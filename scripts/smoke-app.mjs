import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = (process.env.DEAL_FINDER_SMOKE_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const adminMode = process.env.DEAL_FINDER_SMOKE_ADMIN_MODE ?? "enabled";

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === "\"" && inQuotes && next === "\"") {
      current += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function readCsv(relativePath) {
  const text = fs.readFileSync(path.join(repoRoot, relativePath), "utf8").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();
  const [headerLine, ...lines] = text.split("\n");
  const headers = parseCsvLine(headerLine);

  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function publicAssetUrl(value) {
  const publicPrefix = "app/public/";

  if (value.startsWith(publicPrefix)) {
    return `/${value.slice(publicPrefix.length)}`;
  }

  return value.startsWith("/") ? value : "";
}

async function fetchPath(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("text/") || contentType.includes("html") || contentType.includes("json")
    ? await response.text()
    : "";

  return { body, contentType, pathname, response };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function assertPage(pathname, needles = []) {
  const { body, response } = await fetchPath(pathname);
  const decodedBody = decodeHtmlEntities(body);
  assert(response.status === 200, `${pathname}: expected 200, got ${response.status}`);

  for (const needle of needles) {
    assert(decodedBody.includes(needle), `${pathname}: missing text ${JSON.stringify(needle)}`);
  }

  return decodedBody;
}

async function assertAsset(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);
  const contentType = response.headers.get("content-type") ?? "";
  const bytes = await response.arrayBuffer();

  assert(response.status === 200, `${pathname}: expected 200, got ${response.status}`);
  assert(contentType.startsWith("image/"), `${pathname}: expected image content type, got ${contentType}`);
  assert(bytes.byteLength > 1000, `${pathname}: expected non-empty proof image, got ${bytes.byteLength} bytes`);
}

async function assertJson(pathname, needles = []) {
  const { body, contentType, response } = await fetchPath(pathname);
  assert(response.status === 200, `${pathname}: expected 200, got ${response.status}`);
  assert(contentType.includes("json") || contentType.includes("manifest"), `${pathname}: expected JSON-like content type, got ${contentType}`);

  for (const needle of needles) {
    assert(body.includes(needle), `${pathname}: missing text ${JSON.stringify(needle)}`);
  }
}

async function assertMissingPage(pathname) {
  const { response } = await fetchPath(pathname);
  assert(response.status === 404, `${pathname}: expected 404, got ${response.status}`);
}

async function assertAdminDisabled(pathname) {
  const { body, response } = await fetchPath(pathname);
  assert(response.status === 404, `${pathname}: expected production admin 404, got ${response.status}`);
  assert(body.includes("Admin routes are disabled in production."), `${pathname}: missing production admin-disabled message`);
}

const deals = readCsv("fixtures/prototype/deals.csv");
const mainMarketCities = new Set(["Wilmington", "Carolina Beach"]);
const southportMarketCities = new Set(["Southport", "Oak Island"]);
const publicFixtureCities = new Set(["Wilmington", "Southport", "Oak Island", "Carolina Beach"]);
const restaurants = readCsv("fixtures/prototype/restaurants.csv").filter((row) =>
  publicFixtureCities.has(row.city) &&
  row.state === "NC" &&
  row.status === "active" &&
  row.fixture_data_class === "verified_static" &&
  row.is_live_data === "false"
);
const restaurantsById = new Map(restaurants.map((restaurant) => [restaurant.restaurant_id, restaurant]));
const mainRestaurants = restaurants.filter((restaurant) => mainMarketCities.has(restaurant.city));
const southportRestaurants = restaurants.filter((restaurant) => southportMarketCities.has(restaurant.city));

function easternDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/New_York",
    year: "numeric"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function isTrue(value) {
  return String(value ?? "").toLowerCase() === "true";
}

function dealIsFresh(deal) {
  const today = easternDateString();
  const nextCheckDue = deal.next_check_due || "";
  const expiresOn = deal.expires_on || "";

  if (!nextCheckDue && !expiresOn) {
    return false;
  }

  if (nextCheckDue && nextCheckDue < today) {
    return false;
  }

  if (expiresOn && expiresOn < today) {
    return false;
  }

  return true;
}

function passesPublicRuntimeDealGate(deal) {
  const restaurant = restaurantsById.get(deal.restaurant_id);

  return Boolean(
    restaurant &&
    isTrue(deal.mvp_publish_eligible) &&
    isTrue(deal.public_copy_approved) &&
    ["approved", "approved_with_uncertainty"].includes(deal.workflow_status) &&
    deal.confidence_status === "verified" &&
    deal.review_decision === "approved" &&
    deal.published_at &&
    !deal.hidden_at &&
    deal.conflict_detected === "false" &&
    deal.is_live_data === "false" &&
    deal.restaurant_id &&
    deal.source_id &&
    deal.review_task_id &&
    (deal.source_capture_id || deal.direct_confirmation_id) &&
    dealIsFresh(deal)
  );
}

const visibleDeals = deals.filter(passesPublicRuntimeDealGate);
const hiddenDeals = deals.filter((deal) => !passesPublicRuntimeDealGate(deal));
const mainVisibleDeals = visibleDeals.filter((deal) => mainMarketCities.has(restaurantsById.get(deal.restaurant_id)?.city ?? ""));
const southportVisibleDeals = visibleDeals.filter((deal) => southportMarketCities.has(restaurantsById.get(deal.restaurant_id)?.city ?? ""));
const proofAssets = Array.from(new Set(visibleDeals.map((deal) => publicAssetUrl(deal.screenshot_path)).filter(Boolean)));

const failures = [];

async function check(label, task) {
  try {
    await task();
    console.log(`ok ${label}`);
  } catch (error) {
    failures.push(`${label}: ${error.message}`);
    console.error(`fail ${label}: ${error.message}`);
  }
}

await check("home", () => assertPage("/", ["Forkcast", "Today"]));
await check("robots noindex", () => assertPage("/robots.txt", ["User-Agent: *", "Disallow: /"]));
await check("pwa manifest", () => assertJson("/manifest.webmanifest", ["Forkcast", "\"start_url\":\"/tonight\"", "\"display\":\"standalone\""]));
await check("pwa icon 192", () => assertAsset("/icon-192.png"));
await check("pwa icon 512", () => assertAsset("/icon-512.png"));
await check("pwa apple touch icon", () => assertAsset("/apple-touch-icon.png"));
await check("tonight", () => assertPage("/tonight", ["Today's forecast", "Verify details before you order"]));
await check("tonight quick confirm", () => assertPage("/tonight", ["I checked this"]));
await check("tonight keyword search", () => assertPage("/tonight?q=taco", ["Search today's deals", "$1.99 tacos"]));
await check("tonight breakfast filter", () => assertPage("/tonight?meal=breakfast", ["Today's forecast", "Breakfast"]));
await check("tonight lunch filter", () => assertPage("/tonight?meal=lunch", ["Today's forecast", "Lunch"]));
await check("tonight dinner filter", () => assertPage("/tonight?meal=dinner", ["Today's forecast", "Dinner"]));
await check("tonight legacy meal quick filter", () => assertPage("/tonight?quick=lunch", ["Today's forecast", "Lunch"]));
await check("deals filters", () => assertPage("/deals?area=Downtown&day=Tuesday&quick=under-10&sort=area", ["$10 & under", "Food specials worth knowing"]));
await check("deals quick confirm", () => assertPage("/deals", ["Food specials worth knowing", "I checked this"]));
await check("deals keyword search", () => assertPage("/deals?q=taco", ["Search deals", "$2 tacos"]));
await check("deals keyword no match", () => assertPage("/deals?q=notarealdeal", ["No specials match \"notarealdeal\" yet."]));
await check("deals breakfast filter", () => assertPage("/deals?meal=breakfast", ["Breakfast", "Katy's Grill & Bar"]));
await check("deals lunch filter", () => assertPage("/deals?meal=lunch", ["Lunch", "Hell's Kitchen"]));
await check("deals dinner filter", () => assertPage("/deals?meal=dinner", ["Dinner", "$2 tacos"]));
await check("deals legacy meal quick filter", () => assertPage("/deals?quick=lunch", ["Lunch", "Hell's Kitchen"]));
await check("carolina beach main filter", () => assertPage("/deals?area=Carolina%20Beach", ["Carolina Beach", "K38 Baja Grill"]));
await check("southport separate from main deals", async () => {
  const body = await assertPage("/deals", ["Food specials worth knowing"]);
  assert(!body.includes("Provision Company"), "/deals: Southport rows should stay out of main deals");
  assert(!body.includes("Fishy Fishy Cafe"), "/deals: Southport rows should stay out of main deals");
});
await check("monkey junction filter", () => assertPage("/deals?area=Monkey%20Junction", ["Monkey Junction", "non-alcoholic drink purchase"]));
await check("carryout removed", () => assertMissingPage("/carryout"));
await check("report", async () => {
  const body = await assertPage("/report", [
    "Share a Forkcast update",
    "Correct info",
    "Suggest a restaurant",
    "Send a special",
    "Submit feedback to owner",
    "Send update"
  ]);
  assert(!body.includes("mailto:"), "/report: should not rely on mailto handoff");
});
if (process.env.DEAL_FINDER_SMOKE_SKIP_REPORT_POST === "1") {
  await check("report submit api skipped", async () => undefined);
} else {
  await check("report submit api", async () => {
    const response = await fetch(`${baseUrl}/api/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forkcast-Smoke-Test": "true"
      },
      body: JSON.stringify({
        deal_id: "smoke-deal-id",
        deal_title: "Smoke test special",
        deal_url: "https://example.com/smoke-deal",
        message: "Smoke test report",
        page_url: `${baseUrl}/report`,
        preferred_contact: "no follow-up",
        reporter_email: "smoke@example.com",
        reporter_name: "Smoke Tester",
        restaurant_id: "smoke-restaurant-id",
        restaurant_name: "Smoke test",
        source_context: "Smoke test",
        submission_type: "submit_deal"
      })
    });
    const body = await response.json();
    assert(response.status === 200, `/api/reports: expected 200, got ${response.status}`);
    assert(
      body.message === "Thanks. This will be reviewed before anything changes on the site." ||
        body.message === "Local test received. Add HubSpot settings before sharing this form." ||
        body.message === "Smoke test received. Report intake dry-run is enabled.",
      "/api/reports: unexpected success copy"
    );
  });
  await check("owner feedback submit api", async () => {
    const response = await fetch(`${baseUrl}/api/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forkcast-Smoke-Test": "true"
      },
      body: JSON.stringify({
        message: "Smoke test owner feedback",
        page_url: `${baseUrl}/report?type=owner_feedback`,
        preferred_contact: "no follow-up",
        reporter_email: "owner-smoke@example.com",
        reporter_name: "Owner Smoke Tester",
        source_context: "owner_feedback | Forkcast owner feedback",
        submission_type: "owner_feedback"
      })
    });
    const body = await response.json();
    assert(response.status === 200, `/api/reports owner_feedback: expected 200, got ${response.status}`);
    assert(
      body.message === "Thanks. This will be reviewed before anything changes on the site." ||
        body.message === "Local test received. Add HubSpot settings before sharing this form." ||
        body.message === "Smoke test received. Report intake dry-run is enabled.",
      "/api/reports owner_feedback: unexpected success copy"
    );
  });
  await check("deal confirmation submit api", async () => {
    const response = await fetch(`${baseUrl}/api/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forkcast-Smoke-Test": "true"
      },
      body: JSON.stringify({
        deal_id: "smoke-deal-id",
        deal_title: "Smoke confirmed special",
        message: "Smoke test user confirmed this deal in person.",
        page_url: `${baseUrl}/deals/smoke-deal-id`,
        restaurant_id: "smoke-restaurant-id",
        restaurant_name: "Smoke test",
        source_context: "confirm_in_person | Smoke confirmed special | /deals/smoke-deal-id",
        submission_type: "confirm_in_person"
      })
    });
    const body = await response.json();
    assert(response.status === 200, `/api/reports confirm_in_person: expected 200, got ${response.status}`);
    assert(
      body.message === "Thanks. This will be reviewed before anything changes on the site." ||
        body.message === "Local test received. Add HubSpot settings before sharing this form." ||
        body.message === "Smoke test received. Report intake dry-run is enabled.",
      "/api/reports confirm_in_person: unexpected success copy"
    );
  });
}
await check("report with deal context", () => assertPage("/report?dealId=deal-beat-street-tuesday-2-tacos", [
  "Share a Forkcast update",
  "$2 tacos",
  "Confirm in person",
  "Submit feedback to owner"
]));
await check("report confirmation type", () => assertPage("/report?dealId=deal-beat-street-tuesday-2-tacos&type=confirm_in_person", [
  "Share a Forkcast update",
  "Confirm in person",
  "$2 tacos"
]));
await check("report with restaurant context", () => assertPage("/report?restaurantId=beat-street", [
  "Share a Forkcast update",
  "Beat Street",
  "Restaurant",
  "Submit feedback to owner"
]));
await check("owner feedback report", async () => {
  const body = await assertPage("/report?type=owner_feedback", [
    "Submit feedback to owner",
    "Forkcast owner feedback",
    "Not item-specific",
    "This message is not attached to a deal or restaurant."
  ]);
  assert(!body.includes("Item-specific update"), "/report?type=owner_feedback: should not show item-specific choices");
  assert(!body.includes("Correct info"), "/report?type=owner_feedback: should not show correction choice");
  assert(!body.includes("Suggest a restaurant"), "/report?type=owner_feedback: should not show restaurant suggestion choice");
  assert(!body.includes("Send a special"), "/report?type=owner_feedback: should not show deal submission choice");
  assert(!body.includes("Restaurant name"), "/report?type=owner_feedback: should not show restaurant field");
  assert(!body.includes("Deal or special"), "/report?type=owner_feedback: should not show deal field");
});
if (adminMode === "enabled") {
  await check("admin", () => assertPage("/admin", ["Ops dashboard"]));
  await check("admin ops", () => assertPage("/admin/ops", ["Ops dashboard"]));
  await check("admin review", () => assertPage("/admin/review", ["Review queue"]));
  await check("admin review packet", () => assertPage("/admin/review/cand-cb-fentonis-lunch-special", ["Fentoni", "Admin review packet"]));
  await check("admin review worksheet", () => assertPage("/admin/review/cand-cb-fentonis-lunch-special/worksheet", ["Fentoni", "Admin review worksheet", "Publication blockers"]));
  await check("admin review dry-run diff", () => assertPage("/admin/review/cand-cb-fentonis-lunch-special/dry-run-diff", ["Fentoni", "Admin dry-run diff", "No-write dry run"]));
  await check("admin review fixture preview", () => assertPage("/admin/review/cand-cb-fentonis-lunch-special/fixture-preview", ["Fentoni", "Admin fixture preview", "Future promotion packet"]));
  await check("admin source gaps", () => assertPage("/admin/source-gaps", ["Source gap report"]));
} else if (adminMode === "disabled") {
  await check("admin disabled", () => assertAdminDisabled("/admin"));
  await check("admin ops disabled", () => assertAdminDisabled("/admin/ops"));
  await check("admin review disabled", () => assertAdminDisabled("/admin/review"));
  await check("admin source gaps disabled", () => assertAdminDisabled("/admin/source-gaps"));
} else if (adminMode !== "skip") {
  throw new Error(`Unsupported DEAL_FINDER_SMOKE_ADMIN_MODE: ${adminMode}`);
}
await check("restaurants index", async () => {
  const body = await assertPage("/restaurants", [
    "Restaurants Forkcast is watching",
    "On our radar",
    "Forkcast is tracking"
  ]);

  assert(!body.includes("PinPoint Restaurant"), "/restaurants: needs_review restaurant should not render publicly");
  assert(body.includes("K38 Baja Grill"), "/restaurants: Carolina Beach rows should render in main restaurants");
  assert(!body.includes("Provision Company"), "/restaurants: Southport rows should stay out of main restaurants");
});
await check("restaurants keyword search", async () => {
  const body = await assertPage("/restaurants?q=K38", ["Search restaurants", "K38 Baja Grill"]);
  assert(!body.includes("Provision Company"), "/restaurants?q=K38: Southport rows should stay out of main restaurants");
});
await check("southport prototype", () => assertPage("/southport", ["Today's forecast", "Provision Company", "Southport is a separate soft-pilot market"]));
await check("southport quick confirm", () => assertPage("/southport", ["Today's forecast", "I checked this"]));
await check("southport all deals", () => assertPage("/southport/deals", ["All Southport deals", "Provision Company", "Southport preview"]));
await check("southport restaurants", () => assertPage("/southport/restaurants", ["Southport restaurants", "View Southport deals", "Southport preview"]));
await check("southport deals keyword search", () => assertPage("/southport/deals?q=lunch", ["Search Southport deals", "Provision Company", "Southport preview"]));
await check("southport deals lunch filter", () => assertPage("/southport/deals?quick=lunch", ["Lunch", "Provision Company", "Southport preview"]));
await check("southport restaurants keyword search", () => assertPage("/southport/restaurants?q=provision", ["Search Southport restaurants", "Provision Company", "Southport preview"]));
await check("southport main detail isolation", async () => {
  for (const deal of southportVisibleDeals) {
    await assertMissingPage(`/deals/${deal.deal_id}`);
  }

  for (const restaurant of southportRestaurants) {
    await assertMissingPage(`/restaurants/${restaurant.restaurant_id}`);
  }
});
await check("invalid deal filters fallback", () => assertPage("/deals?area=Nope&day=Funday&quick=nope&sort=nope", [
  "Food specials worth knowing",
  "$2 tacos"
]));
await check("missing deal 404", () => assertMissingPage("/deals/not-a-real-deal"));
await check("missing restaurant 404", () => assertMissingPage("/restaurants/not-a-real-restaurant"));
await check("withheld restaurant 404", () => assertMissingPage("/restaurants/pinpoint-restaurant"));
await check("stale deal detail hidden", () => assertMissingPage("/deals/deal-beer-barrio-tuesday-pork-tacos"));
await check("stale restaurant deal omitted", async () => {
  const body = await assertPage("/restaurants/beer-barrio", [
    "Beer Barrio",
    "/deals/deal-wilmington-beer-barrio-2026-06-16-pork-tacos"
  ]);
  assert(!body.includes("deal-beer-barrio-tuesday-pork-tacos"), "/restaurants/beer-barrio: stale deal link should not render");
});
await check("sample deal proof UI", () => assertPage("/deals/deal-beat-street-tuesday-2-tacos", [
  "$2 tacos",
  "Original wording",
  "Shown below",
  "Check official details",
  "/evidence/source-screenshots/src-beat-street-primary.png"
]));
await check("sample deal quick confirm", () => assertPage("/deals/deal-whiskey-trail-thursday-3-off-burgers", [
  "Whiskey Trail",
  "$3 off burgers",
  "I checked this"
]));
await check("sample restaurant deals", () => assertPage("/restaurants/beat-street", [
  "beat-street",
  "$2 tacos",
  "/deals/deal-beat-street-tuesday-2-tacos"
]));

for (const deal of mainVisibleDeals) {
  await check(`deal ${deal.deal_id}`, () => assertPage(`/deals/${deal.deal_id}`, [
    "Official details",
    publicAssetUrl(deal.screenshot_path)
  ]));
}

for (const deal of hiddenDeals) {
  await check(`hidden deal ${deal.deal_id}`, () => assertMissingPage(`/deals/${deal.deal_id}`));
}

for (const restaurant of mainRestaurants) {
  await check(`restaurant ${restaurant.restaurant_id}`, () => assertPage(`/restaurants/${restaurant.restaurant_id}`, [restaurant.restaurant_id]));
}

for (const asset of proofAssets) {
  await check(`proof asset ${asset}`, () => assertAsset(asset));
}

if (failures.length) {
  console.error("\nSmoke test failures:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`\nSmoke tests passed: ${visibleDeals.length} visible deals, ${hiddenDeals.length} hidden deals, ${restaurants.length} restaurants, ${proofAssets.length} proof assets.`);
