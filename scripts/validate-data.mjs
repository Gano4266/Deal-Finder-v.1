import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const auditsDir = path.join(repoRoot, "ops/audits");

const csvFiles = [
  "fixtures/prototype/restaurants.csv",
  "fixtures/prototype/sources.csv",
  "fixtures/prototype/source-captures.csv",
  "fixtures/prototype/source-checks.csv",
  "fixtures/prototype/deals.csv",
  "fixtures/prototype/review-tasks.csv",
  "fixtures/prototype/audit-events.csv",
  "ops/seeds/wilmington-carryout-places.csv",
  "ops/seeds/wilmington-restaurant-sources.csv",
  "ops/seeds/wilmington-deal-candidates.csv",
  "ops/seeds/wilmington-review-tasks.csv"
];

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
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
  const absolutePath = path.join(repoRoot, relativePath);
  const text = fs.readFileSync(absolutePath, "utf8").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();
  const [headerLine, ...lines] = text.split("\n");
  const headers = parseCsvLine(headerLine);
  const rows = [];

  lines.filter(Boolean).forEach((line, index) => {
    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      throw new Error(`${relativePath}: row ${index + 2} has ${values.length} fields, expected ${headers.length}`);
    }

    rows.push(Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] ?? ""])));
  });

  return { headers, rows };
}

function requireValue(row, field, label) {
  if (!row[field] || row[field].trim() === "") {
    throw new Error(`${label}: missing ${field}`);
  }
}

function parseDate(value) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);
  if ([year, month, day].some(Number.isNaN)) {
    throw new Error(`Invalid ISO date: ${value}`);
  }

  return new Date(year, month - 1, day);
}

function assertUrlIfPresent(value, label, field) {
  if (!value) {
    return;
  }

  try {
    new URL(value);
  } catch (error) {
    throw new Error(`${label}: ${field} is not a valid URL`);
  }
}

function todayInWilmington() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const valueFor = (type) => Number(parts.find((part) => part.type === type)?.value);
  return new Date(valueFor("year"), valueFor("month") - 1, valueFor("day"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function candidateId(row) {
  const restaurant = row.restaurant_name;
  const title = row.deal_title;

  if (restaurant === "Ponysaurus Brewing Co. Wilmington" && title === "1/2 price wings") {
    return "seed-ponysaurus-monday-half-price-wings";
  }

  if (restaurant === "Ponysaurus Brewing Co. Wilmington" && title === "$10 one-topping pizza") {
    return "seed-ponysaurus-tuesday-10-pizza";
  }

  if (restaurant === "Beat Street" && title === "Taco Tuesday $2 tacos") {
    return "seed-beat-street-tuesday-2-tacos";
  }

  if (restaurant === "Ponysaurus Brewing Co. Wilmington" && title === "1/2 price burger") {
    return "seed-ponysaurus-wednesday-half-price-burger";
  }

  if (restaurant === "Caprice Bistro" && title === "Coq au Vin Tuesday") {
    return "seed-caprice-bistro-tuesday-coq-au-vin";
  }

  if (restaurant === "Hell's Kitchen" && title === "Tuesday meatball sub and fries") {
    return "seed-hells-kitchen-tuesday-meatball-sub";
  }

  return `seed-${slug(row.restaurant_name)}-${slug(row.deal_day)}-${slug(row.deal_title)}`;
}

function assertLocalEvidencePath(value, label, field) {
  if (!value || /^https?:\/\//.test(value)) {
    return;
  }

  const absolutePath = path.join(repoRoot, value);
  assert(fs.existsSync(absolutePath), `${label}: ${field} points to missing local evidence ${value}`);
}

function readMetadataJson(value, label) {
  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`${label}: metadata_json is not valid JSON`);
  }
}

function fileSha256(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(absolutePath)).digest("hex")}`;
}

const data = Object.fromEntries(csvFiles.map((file) => [file, readCsv(file)]));
const weeklyAuditFiles = fs.existsSync(auditsDir)
  ? fs.readdirSync(auditsDir).filter((file) => /^week-of-\d{4}-\d{2}-\d{2}\.md$/.test(file))
  : [];

assert(weeklyAuditFiles.length > 0, "Missing weekly audit artifact in ops/audits");

const restaurants = data["fixtures/prototype/restaurants.csv"].rows;
const sources = data["fixtures/prototype/sources.csv"].rows;
const captures = data["fixtures/prototype/source-captures.csv"].rows;
const checks = data["fixtures/prototype/source-checks.csv"].rows;
const deals = data["fixtures/prototype/deals.csv"].rows;
const reviewTasks = data["fixtures/prototype/review-tasks.csv"].rows;
const auditEvents = data["fixtures/prototype/audit-events.csv"].rows;
const carryoutPlaces = data["ops/seeds/wilmington-carryout-places.csv"].rows;
const seedRestaurantSources = data["ops/seeds/wilmington-restaurant-sources.csv"].rows;
const candidates = data["ops/seeds/wilmington-deal-candidates.csv"].rows;
const seedReviewTasks = data["ops/seeds/wilmington-review-tasks.csv"].rows;
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "fixtures/prototype/fixture-manifest.json"), "utf8"));

const restaurantIds = new Set(restaurants.map((row) => row.restaurant_id));
const sourceIds = new Set(sources.map((row) => row.source_id));
const captureIds = new Set(captures.map((row) => row.source_capture_id));
const checkIds = new Set(checks.map((row) => row.source_check_id));
const reviewTaskIds = new Set(reviewTasks.map((row) => row.review_task_id));
const auditEventIds = new Set(auditEvents.map((row) => row.audit_event_id));
const candidateIds = new Set(candidates.map(candidateId));
const restaurantsById = new Map(restaurants.map((row) => [row.restaurant_id, row]));
const sourcesById = new Map(sources.map((row) => [row.source_id, row]));
const capturesById = new Map(captures.map((row) => [row.source_capture_id, row]));
const checksById = new Map(checks.map((row) => [row.source_check_id, row]));
const reviewTasksById = new Map(reviewTasks.map((row) => [row.review_task_id, row]));
const seedReviewTasksByCandidate = new Map(seedReviewTasks.map((row) => [row.related_id, row]));

const allowedFixtureRestaurantStatuses = new Set(["active", "needs_review", "inactive"]);
const allowedSourceTiers = new Set(["tier_1_official", "tier_2_official_social"]);
const allowedPublicWorkflowStatuses = new Set(["approved", "approved_with_uncertainty"]);
const terminalSeedCandidateStatuses = new Set(["rejected", "expired", "superseded"]);
const allowedSeedCandidateStatuses = new Set(["needs_review", "verified", ...terminalSeedCandidateStatuses]);
const allowedSeedSourceStatuses = new Set(["verified", "likely", "needs_review"]);
const sha256Pattern = /^sha256:[a-f0-9]{64}$/;
const today = todayInWilmington();

function passesPublicRestaurantFilter(row) {
  return (
    row.city === "Wilmington" &&
    row.state === "NC" &&
    row.status === "active" &&
    row.fixture_data_class === "verified_static" &&
    row.is_live_data === "false" &&
    Boolean(row.prototype_notice)
  );
}

for (const restaurant of restaurants) {
  const label = restaurant.restaurant_id;

  [
    "restaurant_id",
    "name",
    "city",
    "state",
    "neighborhood",
    "address",
    "official_website",
    "cuisine",
    "tags",
    "status",
    "last_checked",
    "fixture_data_class",
    "is_live_data",
    "prototype_notice"
  ].forEach((field) => requireValue(restaurant, field, label));

  assert(restaurant.city === "Wilmington", `${label}: fixture restaurant city must be Wilmington`);
  assert(restaurant.state === "NC", `${label}: fixture restaurant state must be NC`);
  assert(
    allowedFixtureRestaurantStatuses.has(restaurant.status),
    `${label}: unsupported fixture restaurant status ${restaurant.status}`
  );
  assert(restaurant.fixture_data_class === "verified_static", `${label}: restaurant fixture_data_class must be verified_static`);
  assert(restaurant.is_live_data === "false", `${label}: restaurant must not be live data`);
  parseDate(restaurant.last_checked);
  ["official_website", "official_instagram", "official_facebook", "google_business_url", "ordering_url"].forEach((field) =>
    assertUrlIfPresent(restaurant[field], label, field)
  );
}

assert(restaurantIds.size === restaurants.length, "Restaurant IDs must be unique");

for (const deal of deals) {
  const label = deal.deal_id;

  [
    "deal_id",
    "candidate_id",
    "restaurant_id",
    "source_id",
    "source_capture_id",
    "source_check_id",
    "review_task_id",
    "public_title",
    "public_description",
    "published_at",
    "last_verified_at",
    "next_check_due",
    "source_quote",
    "evidence_summary",
    "content_hash",
    "screenshot_path"
  ].forEach((field) => requireValue(deal, field, label));

  assert(candidateIds.has(deal.candidate_id), `${label}: candidate_id is not a promoted seed candidate`);
  assert(restaurantIds.has(deal.restaurant_id), `${label}: missing restaurant row ${deal.restaurant_id}`);
  assert(passesPublicRestaurantFilter(restaurantsById.get(deal.restaurant_id)), `${label}: restaurant row does not pass public restaurant filter`);
  assert(sourceIds.has(deal.source_id), `${label}: missing source row ${deal.source_id}`);
  assert(captureIds.has(deal.source_capture_id), `${label}: missing capture row ${deal.source_capture_id}`);
  assert(checkIds.has(deal.source_check_id), `${label}: missing source check row ${deal.source_check_id}`);
  assert(reviewTaskIds.has(deal.review_task_id), `${label}: missing review task row ${deal.review_task_id}`);
  assert(allowedSourceTiers.has(deal.source_tier), `${label}: unacceptable source tier ${deal.source_tier}`);
  assert(deal.confidence_status === "verified", `${label}: confidence_status must be verified`);
  assert(allowedPublicWorkflowStatuses.has(deal.workflow_status), `${label}: workflow_status cannot publish as ${deal.workflow_status}`);
  assert(deal.review_decision === "approved", `${label}: review_decision must be approved`);
  assert(deal.mvp_publish_eligible === "true", `${label}: mvp_publish_eligible must be true`);
  assert(deal.public_copy_approved === "true", `${label}: public_copy_approved must be true`);
  assert(deal.conflict_detected === "false", `${label}: conflicted deals cannot publish`);
  assert(!deal.hidden_at, `${label}: hidden_at must be blank for public deals`);
  assert(deal.alcohol_classification === "food_only", `${label}: public prototype deals must be food_only`);
  assert(deal.fixture_data_class === "verified_static", `${label}: fixture_data_class must be verified_static`);
  assert(deal.is_live_data === "false", `${label}: prototype deals must not be live data`);
  assert(Boolean(deal.prototype_notice), `${label}: missing prototype_notice`);
  assert(sha256Pattern.test(deal.content_hash), `${label}: content_hash must be sha256:<64 hex chars>`);
  assertLocalEvidencePath(deal.archive_url_or_path, label, "archive_url_or_path");
  assertLocalEvidencePath(deal.evidence_url_or_path, label, "evidence_url_or_path");
  assertLocalEvidencePath(deal.screenshot_path, label, "screenshot_path");

  const source = sourcesById.get(deal.source_id);
  const capture = capturesById.get(deal.source_capture_id);
  const check = checksById.get(deal.source_check_id);
  const reviewTask = reviewTasksById.get(deal.review_task_id);

  assert(source.restaurant_id === deal.restaurant_id, `${label}: source restaurant does not match deal restaurant`);
  assert(source.source_tier === deal.source_tier, `${label}: source_tier does not match source inventory`);
  assert(source.source_status === "active", `${label}: source row is not active`);
  assert(source.wilmington_location_match === "true", `${label}: source row does not confirm Wilmington location`);
  assert(capture.restaurant_id === deal.restaurant_id, `${label}: capture restaurant does not match deal restaurant`);
  assert(capture.source_id === deal.source_id, `${label}: capture source does not match deal source`);
  assert(deal.source_url === capture.source_final_url, `${label}: deal source_url does not match capture source_final_url`);
  assert(deal.archive_url_or_path === capture.archive_url_or_path, `${label}: deal archive does not match capture archive`);
  assert(Boolean(capture.content_hash), `${label}: public source capture is missing content_hash`);
  assert(sha256Pattern.test(capture.content_hash), `${label}: capture content_hash must be sha256:<64 hex chars>`);
  assertLocalEvidencePath(capture.archive_url_or_path, label, "capture archive_url_or_path");
  const captureMetadata = readMetadataJson(capture.metadata_json, label);
  assert(
    captureMetadata.hash_subject === "extracted_text_or_confirmation_note",
    `${label}: capture metadata_json.hash_subject must describe the captured text hash`
  );
  assert(
    captureMetadata.evidence_file_path === capture.archive_url_or_path,
    `${label}: capture metadata_json.evidence_file_path must match archive_url_or_path`
  );
  assert(
    captureMetadata.official_url === capture.source_final_url,
    `${label}: capture metadata_json.official_url must match source_final_url`
  );
  assert(
    sha256Pattern.test(captureMetadata.evidence_file_sha256 || ""),
    `${label}: capture metadata_json.evidence_file_sha256 must be sha256:<64 hex chars>`
  );
  assert(
    captureMetadata.evidence_file_sha256 === fileSha256(capture.archive_url_or_path),
    `${label}: capture metadata_json.evidence_file_sha256 does not match local evidence file`
  );
  if (captureMetadata.screenshot_file_sha256 || captureMetadata.screenshot_file_path) {
    assert(
      captureMetadata.screenshot_file_path === capture.screenshot_path,
      `${label}: capture metadata_json.screenshot_file_path must match screenshot_path`
    );
    assert(
      sha256Pattern.test(captureMetadata.screenshot_file_sha256 || ""),
      `${label}: capture metadata_json.screenshot_file_sha256 must be sha256:<64 hex chars>`
    );
    assert(
      captureMetadata.screenshot_file_sha256 === fileSha256(capture.screenshot_path),
      `${label}: capture metadata_json.screenshot_file_sha256 does not match local screenshot file`
    );
  }
  assert(check.restaurant_id === deal.restaurant_id, `${label}: source check restaurant does not match deal restaurant`);
  assert(check.source_id === deal.source_id, `${label}: source check source does not match deal source`);
  assert(check.source_capture_id_after === deal.source_capture_id, `${label}: source check does not point to deal capture`);
  assert(check.result === "confirmed", `${label}: public source check must be confirmed`);
  assert(Boolean(check.content_hash), `${label}: public source check is missing content_hash`);
  assert(sha256Pattern.test(check.content_hash), `${label}: source check content_hash must be sha256:<64 hex chars>`);
  assert(Boolean(check.evidence_url_or_path), `${label}: public source check is missing evidence_url_or_path`);
  assert(
    check.evidence_url_or_path === capture.archive_url_or_path,
    `${label}: source check evidence_url_or_path must match capture archive`
  );
  assert(
    capture.screenshot_path === deal.screenshot_path,
    `${label}: capture screenshot_path must match deal screenshot_path`
  );
  assert(
    check.screenshot_path === deal.screenshot_path,
    `${label}: source check screenshot_path must match deal screenshot_path`
  );
  assertLocalEvidencePath(check.evidence_url_or_path, label, "source check evidence_url_or_path");
  assertLocalEvidencePath(capture.screenshot_path, label, "capture screenshot_path");
  assertLocalEvidencePath(check.screenshot_path, label, "source check screenshot_path");
  assert(
    check.deal_id === deal.deal_id || check.affected_deal_ids.split(";").includes(deal.deal_id),
    `${label}: source check must directly reference the public deal`
  );
  assert(reviewTask.deal_id === deal.deal_id, `${label}: review task does not point to deal`);
  assert(reviewTask.restaurant_id === deal.restaurant_id, `${label}: review task restaurant does not match deal`);
  assert(reviewTask.source_id === deal.source_id, `${label}: review task source does not match deal`);
  assert(reviewTask.status === "closed", `${label}: public deal review task must be closed`);
  assert(reviewTask.decision === "approved", `${label}: public deal review task must be approved`);

  const nextCheckDue = parseDate(deal.next_check_due);
  const expiresOn = parseDate(deal.expires_on);
  assert(Boolean(nextCheckDue || expiresOn), `${label}: missing next_check_due or expires_on`);
  if (nextCheckDue) {
    assert(nextCheckDue >= today, `${label}: next_check_due is overdue`);
  }
  if (expiresOn) {
    assert(expiresOn >= today, `${label}: expires_on is expired`);
  }
}

for (const task of reviewTasks.filter((row) => row.deal_id)) {
  assert(auditEventIds.has(task.audit_event_id), `${task.review_task_id}: missing audit event ${task.audit_event_id}`);
}

for (const candidate of candidates) {
  assert(
    allowedSeedCandidateStatuses.has(candidate.status),
    `${candidate.restaurant_name} ${candidate.deal_title}: unsupported seed candidate status ${candidate.status}`
  );
}

for (const source of seedRestaurantSources) {
  const label = source.restaurant_name;

  [
    "restaurant_name",
    "location_area",
    "authority_rank",
    "scan_frequency",
    "manual_review_required",
    "source_status"
  ].forEach((field) => requireValue(source, field, label));

  assert(allowedSeedSourceStatuses.has(source.source_status), `${label}: unsupported seed source_status ${source.source_status}`);
  ["primary_source_url", "secondary_source_url"].forEach((field) =>
    assertUrlIfPresent(source[field], label, field)
  );
}

for (const candidate of candidates.filter((row) => row.status === "needs_review")) {
  const id = candidateId(candidate);
  const task = seedReviewTasksByCandidate.get(id);

  assert(
    !deals.some((deal) => deal.restaurant_name === candidate.restaurant_name && deal.deal_title === candidate.deal_title),
    `${candidate.restaurant_name} ${candidate.deal_title}: needs_review candidate appears as public deal`
  );
  assert(Boolean(task), `${id}: missing open seed review task`);
  assert(task.status === "open", `${id}: seed review task must remain open while candidate needs_review`);
  assert(Boolean(task.next_action), `${id}: seed review task missing next_action`);
  assert(Boolean(task.next_action_due), `${id}: seed review task missing next_action_due`);
  parseDate(task.next_action_due);
}

for (const candidate of candidates.filter((row) => terminalSeedCandidateStatuses.has(row.status))) {
  const id = candidateId(candidate);
  const task = seedReviewTasksByCandidate.get(id);

  assert(Boolean(task), `${id}: terminal seed candidate is missing a review task`);
  assert(task.status === "closed", `${id}: terminal seed review task must be closed`);
  assert(task.decision === candidate.status, `${id}: terminal seed review task must record decision=${candidate.status}`);
  assert(Boolean(task.decision_reason), `${id}: terminal seed review task missing decision_reason`);
  assert(Boolean(task.decided_at), `${id}: terminal seed review task missing decided_at`);
  assert(Boolean(task.decided_by), `${id}: terminal seed review task missing decided_by`);
}

for (const place of carryoutPlaces) {
  const label = place.place_id;

  [
    "place_id",
    "restaurant_name",
    "location_area",
    "source_name",
    "source_url",
    "source_tier",
    "carryout_signal",
    "source_status",
    "public_deal_status",
    "last_checked"
  ].forEach((field) => requireValue(place, field, label));

  assert(
    place.location_area.toLowerCase().includes("monkey junction") ||
      place.location_area.toLowerCase().includes("south wilmington") ||
      place.location_area.toLowerCase().includes("masonboro") ||
      place.location_area.toLowerCase().includes("carolina beach"),
    `${label}: carryout seed is outside the intended Monkey Junction/South Wilmington focus`
  );
  assert(
    place.public_deal_status === "no_public_deal",
    `${label}: carryout place seeds must not imply public deal publication`
  );
  assert(["verified", "needs_review"].includes(place.source_status), `${label}: unsupported source_status ${place.source_status}`);
  if (place.source_status === "verified") {
    assert(allowedSourceTiers.has(place.source_tier), `${label}: verified carryout place needs official source tier`);
  }
  parseDate(place.last_checked);
}

const actualManifestCounts = {
  restaurants: restaurants.length,
  sources: sources.length,
  source_captures: captures.length,
  source_checks: checks.length,
  public_deals: deals.length,
  review_tasks: reviewTasks.length,
  audit_events: auditEvents.length
};

for (const [key, actual] of Object.entries(actualManifestCounts)) {
  const expected = manifest.current_seed_counts?.[key];
  assert(expected === actual, `fixture-manifest current_seed_counts.${key}=${expected}, actual=${actual}`);
}

console.log(`Validated ${deals.length} public prototype deals across ${restaurants.length} restaurants.`);
