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
const restaurants = readCsv("fixtures/prototype/restaurants.csv").filter((row) =>
  row.city === "Wilmington" &&
  row.state === "NC" &&
  row.status === "active" &&
  row.fixture_data_class === "verified_static" &&
  row.is_live_data === "false"
);
const hiddenCarryoutPlaces = readCsv("ops/seeds/wilmington-carryout-places.csv")
  .filter((row) => row.source_status !== "verified")
  .map((row) => row.restaurant_name)
  .filter(Boolean);
const proofAssets = Array.from(new Set(deals.map((deal) => publicAssetUrl(deal.screenshot_path)).filter(Boolean)));

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

await check("home", () => assertPage("/", ["Deal Finder", "Tonight"]));
await check("tonight", () => assertPage("/tonight", ["Tonight in Wilmington", "Static prototype data"]));
await check("deals filters", () => assertPage("/deals?area=Downtown&day=Tuesday&quick=under-10&sort=area", ["Under $10", "Reviewed Wilmington food specials"]));
await check("monkey junction filter", () => assertPage("/deals?area=Monkey%20Junction", ["Monkey Junction", "non-alcoholic drink purchase"]));
await check("carryout", async () => {
  const body = await assertPage("/carryout", [
    "Monkey Junction carryout",
    "not published deal claims",
    "Official-source place records",
    "Islands Fresh Mex Grill - Monkey Junction"
  ]);

  for (const hiddenName of hiddenCarryoutPlaces) {
    assert(!body.includes(hiddenName), `/carryout: non-verified carryout seed should not render publicly: ${hiddenName}`);
  }
});
await check("report", () => assertPage("/report", ["Report stale or incorrect deal info", "does not store submissions in the app yet"]));
await check("report with deal context", () => assertPage("/report?dealId=deal-beat-street-tuesday-2-tacos", [
  "Report stale or incorrect deal info",
  "$2 tacos at Beat Street"
]));
await check("report with restaurant context", () => assertPage("/report?restaurantId=beat-street", [
  "Report stale or incorrect deal info",
  "Beat Street",
  "Tracked restaurant"
]));
if (adminMode === "enabled") {
  await check("admin", () => assertPage("/admin", ["Ops dashboard"]));
  await check("admin ops", () => assertPage("/admin/ops", ["Ops dashboard"]));
  await check("admin review", () => assertPage("/admin/review", ["Review queue"]));
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
    "Restaurants being tracked",
    "Source-only restaurants",
    "Deal counts include only reviewed public food-special rows"
  ]);

  assert(!body.includes("PinPoint Restaurant"), "/restaurants: needs_review restaurant should not render publicly");
});
await check("invalid deal filters fallback", () => assertPage("/deals?area=Nope&day=Funday&quick=nope&sort=nope", [
  "Reviewed Wilmington food specials",
  "$2 tacos at Beat Street"
]));
await check("missing deal 404", () => assertMissingPage("/deals/not-a-real-deal"));
await check("missing restaurant 404", () => assertMissingPage("/restaurants/not-a-real-restaurant"));
await check("withheld restaurant 404", () => assertMissingPage("/restaurants/pinpoint-restaurant"));
await check("sample deal proof UI", () => assertPage("/deals/deal-beat-street-tuesday-2-tacos", [
  "$2 tacos at Beat Street",
  "Visual proof path",
  "Open official source",
  "/evidence/source-screenshots/src-beat-street-primary.png"
]));
await check("sample restaurant deals", () => assertPage("/restaurants/beat-street", [
  "beat-street",
  "$2 tacos at Beat Street",
  "/deals/deal-beat-street-tuesday-2-tacos"
]));

for (const deal of deals) {
  await check(`deal ${deal.deal_id}`, () => assertPage(`/deals/${deal.deal_id}`, [
    deal.deal_id,
    "Visual proof + source quote",
    publicAssetUrl(deal.screenshot_path)
  ]));
}

for (const restaurant of restaurants) {
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

console.log(`\nSmoke tests passed: ${deals.length} deals, ${restaurants.length} restaurants, ${proofAssets.length} proof assets.`);
