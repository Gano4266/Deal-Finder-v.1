import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { dirname } from "node:path";
import { readCsv, type CsvRow } from "./csv";

function hasPrototypeFixtures(directory: string): boolean {
  return existsSync(path.join(directory, "fixtures/prototype/deals.csv"));
}

function searchForRepoRoot(startDirectory: string): string | undefined {
  let current = path.resolve(startDirectory);

  for (let depth = 0; depth < 10; depth += 1) {
    if (hasPrototypeFixtures(current)) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return undefined;
}

function resolveRepoRoot(): string {
  if (process.env.DEAL_FINDER_REPO_ROOT) {
    const configuredRoot = path.resolve(process.env.DEAL_FINDER_REPO_ROOT);
    if (hasPrototypeFixtures(configuredRoot)) {
      return configuredRoot;
    }

    throw new Error(`DEAL_FINDER_REPO_ROOT does not contain fixtures/prototype/deals.csv: ${configuredRoot}`);
  }

  const discoveredRoot = [process.cwd()]
    .map(searchForRepoRoot)
    .find((value): value is string => Boolean(value));

  if (!discoveredRoot) {
    throw new Error("Could not locate Deal Finder repo root. Set DEAL_FINDER_REPO_ROOT to the repo directory.");
  }

  return discoveredRoot;
}

const repoRoot = resolveRepoRoot();

const publicDealsPath = path.join(repoRoot, "fixtures/prototype/deals.csv");
const restaurantsPath = path.join(repoRoot, "fixtures/prototype/restaurants.csv");
const sourcesPath = path.join(repoRoot, "fixtures/prototype/sources.csv");
const sourceCapturesPath = path.join(repoRoot, "fixtures/prototype/source-captures.csv");
const sourceChecksPath = path.join(repoRoot, "fixtures/prototype/source-checks.csv");
const reviewTasksPath = path.join(repoRoot, "fixtures/prototype/review-tasks.csv");
const auditEventsPath = path.join(repoRoot, "fixtures/prototype/audit-events.csv");
const directConfirmationsPath = path.join(repoRoot, "fixtures/prototype/direct-confirmations.csv");
const fixtureManifestPath = path.join(repoRoot, "fixtures/prototype/fixture-manifest.json");
const seedRestaurantSourcesPath = path.join(repoRoot, "ops/seeds/wilmington-restaurant-sources.csv");
const seedCandidatesPath = path.join(repoRoot, "ops/seeds/wilmington-deal-candidates.csv");
const seedReviewTasksPath = path.join(repoRoot, "ops/seeds/wilmington-review-tasks.csv");
const carryoutPlacesPath = path.join(repoRoot, "ops/seeds/wilmington-carryout-places.csv");
const researchIntakeRootPath = path.join(repoRoot, "ops/research/intake");

export type PublicDeal = {
  dealId: string;
  restaurantName: string;
  restaurantId: string;
  neighborhood: string;
  area: string;
  areaGroup: PublicAreaGroup;
  address: string;
  publicTitle: string;
  publicDescription: string;
  dealType: string;
  price: string;
  daysAvailable: string;
  daysAvailableLabel: string;
  scheduleKind: "single_day" | "recurring";
  scheduleLabel: string;
  startTime: string;
  endTime: string;
  timeWindow: string;
  sourceUrl: string;
  sourceName: string;
  sourceTier: string;
  sourceDisplayName: string;
  evidenceLabel: string;
  evidenceCapturedAt: string;
  evidenceSummary: string;
  evidenceUrlOrPath: string;
  freshnessLabel: string;
  lastVerifiedAt: string;
  lastVerifiedLabel: string;
  nextCheckDue: string;
  expiresOn: string;
  archiveUrlOrPath: string;
  restrictionNotes: string;
  screenshotPath: string;
  screenshotUrl: string;
  sourceQuote: string;
  contentHash: string;
  dineIn: boolean;
  takeout: boolean;
  delivery: boolean;
  prototypeNotice: string;
};

type PublicMarket = "main" | "southport" | "all";

export const publicDealDayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
] as const;

export type PublicDealDay = (typeof publicDealDayOptions)[number];

export type PublicDealDayCount = {
  day: PublicDealDay;
  count: number;
};

export type PublicDealAreaCount = {
  area: PublicAreaGroup;
  count: number;
};

export const publicAreaGroupOptions = [
  "Downtown",
  "South Front",
  "Monkey Junction",
  "College Rd / UNCW",
  "Mayfaire/Ogden",
  "South Wilmington",
  "Carolina Beach",
  "Other Wilmington"
] as const;

export const southportAreaGroup = "Southport" as const;

export type PublicAreaGroup = (typeof publicAreaGroupOptions)[number] | typeof southportAreaGroup;

export const sourceGapAreaGroupOptions = [
  ...publicAreaGroupOptions,
  southportAreaGroup,
  "Wrightsville / Boundary Review",
  "Porters Neck"
] as const;

export type SourceGapAreaGroup = (typeof sourceGapAreaGroupOptions)[number];

export type RestaurantSummary = {
  restaurantId: string;
  restaurantIds: string[];
  name: string;
  neighborhood: string;
  areaGroup: PublicAreaGroup;
  address: string;
  phone: string;
  phoneHref: string;
  website: string;
  cuisine: string;
  tags: string;
  status: string;
  lastChecked: string;
  publicDealCount: number;
  publicDealDays: string[];
};

export type RestaurantDetail = RestaurantSummary & {
  deals: PublicDeal[];
};

export type ReviewCandidate = {
  dealId?: string;
  candidateId: string;
  restaurantId?: string;
  restaurantName: string;
  dealTitle: string;
  dealDescription?: string;
  publicTitle?: string;
  publicDescription?: string;
  dealDay: string;
  timeWindow: string;
  price: string;
  category: string;
  status: string;
  confidence: string;
  needsAttention: boolean;
  sourceId?: string;
  sourceName: string;
  sourceUrl: string;
  sourceTier?: string;
  evidenceType?: string;
  evidenceCapturedAt?: string;
  evidenceSummary?: string;
  sourceQuote?: string;
  contentHash?: string;
  lastVerified: string;
  restrictions: string;
  notes: string;
  areaName?: string;
  origin?: "seed" | "research_intake";
  intakeFolder?: string;
  publishBlockReason?: string;
  locationScopeStatus?: string;
  locationEvidence?: string;
  sourceCaptureId?: string;
  sourceCheckId?: string;
  directConfirmationId?: string;
  evidencePath?: string;
  archivePath?: string;
  screenshotPath?: string;
  nextCheckDue?: string;
  expiresOn?: string;
  reviewReason?: string;
  reviewDecision?: string;
  decisionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  uncertaintyFlags?: string;
  validationNotes?: string;
  alcoholClassification?: string;
  fixtureDataClass?: string;
  isLiveData?: string;
  prototypeNotice?: string;
  mvpPublishEligible?: string;
  publicCopyApproved?: string;
  conflictDetected?: string;
  serviceModeSummary?: string;
  publicGateSummary?: string;
  promotionBlockers?: string[];
  promotionFieldsNeeded?: string[];
  reviewTask?: {
    taskId: string;
    priority: string;
    status: string;
    nextAction: string;
    nextActionDue: string;
    copyStatus: string;
    foodCopyCheck: string;
    riskFlags: string;
  };
};

export type ReviewCandidateDetail = ReviewCandidate & {
  manualMappingDecisions: string[];
};

export type SourceGap = {
  restaurantName: string;
  locationArea: string;
  areaGroup: SourceGapAreaGroup;
  primarySourceUrl: string;
  sourceStatus: string;
  authorityRank: string;
  scanFrequency: string;
  candidateCount: number;
  needsReviewCount: number;
  verifiedCandidateCount: number;
  blockers: string[];
  priority: "critical" | "high" | "normal";
  notes: string;
  origin?: "seed" | "research_intake";
  intakeFolder?: string;
};

export type CarryoutPlace = {
  placeId: string;
  restaurantName: string;
  locationArea: string;
  address: string;
  cuisine: string;
  carryoutSignal: string;
  deliverySignal: string;
  orderingUrl: string;
  sourceName: string;
  sourceUrl: string;
  sourceStatus: string;
  manualReviewRequired: boolean;
  publicDealStatus: string;
  notes: string;
  lastChecked: string;
};

export type OpsRecheckItem = PublicDeal & {
  dueStatus: "overdue" | "due_soon" | "scheduled";
  daysUntilDue: number | undefined;
  evidenceGaps: string[];
};

export type OpsRecentAuditEvent = {
  auditEventId: string;
  eventAt: string;
  actor: string;
  summary: string;
  restaurantId: string;
  dealId: string;
  evidenceRef: string;
};

export type OpsManifestDrift = {
  key: string;
  expected: number;
  actual: number;
};

export type OpsDashboard = {
  generatedForDate: string;
  stats: {
    publicRows: number;
    publicDealsPassingFilter: number;
    tonightVisibleDeals: number;
    publicBlockedRows: number;
    restaurants: number;
    sources: number;
    sourceCaptures: number;
    sourceChecks: number;
    reviewTasks: number;
    auditEvents: number;
    directConfirmations: number;
    openSeedReviewTasks: number;
    criticalSeedReviewTasks: number;
    highSeedReviewTasks: number;
    verifiedSeedCandidates: number;
    needsReviewSeedCandidates: number;
    terminalSeedCandidates: number;
    researchIntakeBatches: number;
    researchIntakeCandidates: number;
    openResearchIntakeTasks: number;
    verifiedCarryoutPlaces: number;
    hiddenCarryoutPlaces: number;
    sourceGapRows: number;
    criticalSourceGaps: number;
    dueSoonDeals: number;
    overdueDeals: number;
    evidenceGapDeals: number;
    dueSoonSourceChecks: number;
    overdueSourceChecks: number;
    failedSourceChecks: number;
  };
  recheckQueue: OpsRecheckItem[];
  evidenceGapDeals: OpsRecheckItem[];
  openReviewCandidates: ReviewCandidate[];
  sourceGaps: SourceGap[];
  recentAuditEvents: OpsRecentAuditEvent[];
  manifestDrift: OpsManifestDrift[];
};

function isTrue(value: string): boolean {
  return value.toLowerCase() === "true";
}

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function serviceModeSummary(row: CsvRow): string {
  const labels = [
    ["dine_in", "Dine-in"],
    ["takeout", "Takeout"],
    ["delivery", "Delivery"]
  ] as const;
  const modes = labels
    .map(([field, label]) => {
      const value = (row[field] ?? "").toLowerCase();

      if (value === "true") {
        return label;
      }

      if (value === "unknown") {
        return `${label} unknown`;
      }

      return "";
    })
    .filter(Boolean);

  return modes.length > 0 ? modes.join(" / ") : "Service mode missing";
}

function publicGateSummary(row: CsvRow): string {
  const blockers = [];

  if (row.workflow_status !== "approved" && row.workflow_status !== "approved_with_uncertainty") {
    blockers.push(row.workflow_status || "status missing");
  }

  if (!isTrue(row.mvp_publish_eligible ?? "")) {
    blockers.push("not MVP eligible");
  }

  if (!isTrue(row.public_copy_approved ?? "")) {
    blockers.push("copy not approved");
  }

  if (row.review_decision !== "approved") {
    blockers.push("no approval decision");
  }

  return blockers.length > 0 ? blockers.join(" / ") : "Public gate ready";
}

const approvedWorkflowStatuses = new Set(["approved", "approved_with_uncertainty"]);
const officialSourceTiers = new Set(["tier_1_official", "tier_2_official_social"]);
const knownSourceTiers = new Set([
  "tier_1_official",
  "tier_2_official_social",
  "tier_3_partner",
  "tier_4_secondary",
  "tier_5_user_reported"
]);
const aiEvidencePattern = /\b(gpt|chatgpt|deep research|ai|llm|language model|openai|claude|gemini|copilot)\b/i;
const sha256Pattern = /^sha256:[a-f0-9]{64}$/;

function hasAny(row: CsvRow, fields: string[]): boolean {
  return fields.some((field) => !isBlank(row[field] ?? ""));
}

function promotionReadiness(row: CsvRow, date = new Date()): { blockers: string[]; fieldsNeeded: string[] } {
  const blockers: string[] = [];
  const fieldsNeeded = new Set<string>();
  const today = startOfWilmingtonDay(date);

  function requireField(field: string, reason = `missing ${field}`) {
    if (isBlank(row[field] ?? "")) {
      blockers.push(reason);
      fieldsNeeded.add(field);
    }
  }

  function requireAny(fields: string[], reason: string) {
    if (!hasAny(row, fields)) {
      blockers.push(reason);
      fields.forEach((field) => fieldsNeeded.add(field));
    }
  }

  if (!approvedWorkflowStatuses.has(row.workflow_status ?? "")) {
    blockers.push("workflow_status is not approved or approved_with_uncertainty");
    fieldsNeeded.add("workflow_status");
  }

  if (row.confidence_status !== "verified") {
    blockers.push("confidence_status is not verified");
    fieldsNeeded.add("confidence_status");
  }

  if (row.review_decision !== "approved") {
    blockers.push("review_decision is not approved");
    fieldsNeeded.add("review_decision");
  }

  requireField("reviewed_by");
  requireField("reviewed_at");
  requireField("deal_id", "missing deal_id required by current fixture validator");
  requireField("candidate_id", "missing candidate_id required by current fixture validator");
  requireField("restaurant_id");
  requireField("source_id");
  requireAny(["source_capture_id", "direct_confirmation_id"], "missing source_capture_id or direct_confirmation_id");
  requireField("source_capture_id", "missing source_capture_id required by current fixture validator");
  requireField("source_check_id", "missing source_check_id required by current fixture validator");
  requireAny(["source_url", "direct_confirmation_id"], "missing source_url or direct-confirmation evidence pointer");
  requireField("public_title", "missing public_title required by current fixture validator");
  requireField("public_description", "missing public_description required by current fixture validator");
  requireField("source_quote");
  requireField("evidence_summary");
  requireField("content_hash");
  requireAny(["next_check_due", "expires_on"], "missing next_check_due or expires_on");
  requireField("next_check_due", "missing next_check_due required by current fixture validator");
  requireField("review_task_id");
  requireField("evidence_captured_at");
  requireField("last_verified_at", "missing last_verified_at required by current fixture validator");
  requireField("decision_reason");
  requireField("published_at");
  requireField("dine_in", "missing explicit dine_in applicability");
  requireField("takeout", "missing explicit takeout/carryout applicability");
  requireField("delivery", "missing explicit delivery applicability");

  if (row.conflict_detected !== "false") {
    blockers.push("conflict_detected must be exactly false");
    fieldsNeeded.add("conflict_detected");
  }

  if (!isTrue(row.public_copy_approved ?? "")) {
    blockers.push("public_copy_approved is not true");
    fieldsNeeded.add("public_copy_approved");
  }

  if (!isTrue(row.mvp_publish_eligible ?? "")) {
    blockers.push("mvp_publish_eligible is not true");
    fieldsNeeded.add("mvp_publish_eligible");
  }

  if (isBlank(row.source_tier ?? "")) {
    blockers.push("missing source_tier");
    fieldsNeeded.add("source_tier");
  } else if (!knownSourceTiers.has(row.source_tier ?? "")) {
    blockers.push(`source_tier is non-canonical: ${row.source_tier}`);
    fieldsNeeded.add("source_tier");
  } else if (!officialSourceTiers.has(row.source_tier ?? "")) {
    blockers.push(`${row.source_tier} is not accepted by the current public fixture validator`);
    fieldsNeeded.add("source_tier");
  }

  if (!hasAny(row, ["screenshot_path", "archive_url_or_path", "evidence_url_or_path", "direct_confirmation_id"])) {
    blockers.push("missing durable evidence path or direct_confirmation_id");
    fieldsNeeded.add("screenshot_path");
    fieldsNeeded.add("archive_url_or_path");
    fieldsNeeded.add("evidence_url_or_path");
    fieldsNeeded.add("direct_confirmation_id");
  }

  if (isBlank(row.screenshot_path ?? "")) {
    blockers.push("missing screenshot_path required by current fixture validator");
    fieldsNeeded.add("screenshot_path");
  }

  if (!isBlank(row.content_hash ?? "") && !sha256Pattern.test(row.content_hash ?? "")) {
    blockers.push("content_hash is not sha256:<64 hex chars>");
    fieldsNeeded.add("content_hash");
  }

  if (!isBlank(row.hidden_at ?? "")) {
    blockers.push("hidden_at must be blank");
    fieldsNeeded.add("hidden_at");
  }

  if (row.is_live_data !== "false") {
    blockers.push("is_live_data must be false for public prototype fixtures");
    fieldsNeeded.add("is_live_data");
  }

  if (row.fixture_data_class !== "verified_static") {
    blockers.push("fixture_data_class must be verified_static for public prototype fixtures");
    fieldsNeeded.add("fixture_data_class");
  }

  if (isBlank(row.prototype_notice ?? "")) {
    blockers.push("missing prototype_notice required by current fixture validator");
    fieldsNeeded.add("prototype_notice");
  }

  if (row.alcohol_classification !== "food_only") {
    blockers.push("alcohol_classification must be food_only for public prototype deals");
    fieldsNeeded.add("alcohol_classification");
  }

  const allowedLocationScopes = new Set(["wilmington_confirmed", "pilot_market_confirmed"]);
  if (!isBlank(row.location_scope_status ?? "") && !allowedLocationScopes.has(row.location_scope_status ?? "")) {
    blockers.push("location_scope_status is not an approved Wilmington or pilot market scope");
    fieldsNeeded.add("location_scope_status");
  }

  const expiresOn = parseLocalDate(row.expires_on ?? "");
  if (!isBlank(row.expires_on ?? "") && !expiresOn) {
    blockers.push("expires_on is not an ISO date");
    fieldsNeeded.add("expires_on");
  } else if (expiresOn && expiresOn < today) {
    blockers.push("expires_on is expired");
    fieldsNeeded.add("expires_on");
  }

  const nextCheckDue = parseLocalDate(row.next_check_due ?? "");
  if (!isBlank(row.next_check_due ?? "") && !nextCheckDue) {
    blockers.push("next_check_due is not an ISO date");
    fieldsNeeded.add("next_check_due");
  } else if (nextCheckDue && nextCheckDue < today) {
    blockers.push("next_check_due is overdue");
    fieldsNeeded.add("next_check_due");
  }

  const evidenceText = [
    row.source_name,
    row.source_url,
    row.evidence_type,
    row.evidence_summary,
    row.source_quote
  ].join(" ");

  if (aiEvidencePattern.test(evidenceText)) {
    blockers.push("row appears to rely on AI/GPT output as evidence");
    fieldsNeeded.add("source_name");
    fieldsNeeded.add("source_quote");
  }

  return {
    blockers,
    fieldsNeeded: [...fieldsNeeded].sort()
  };
}

const manualMappingDecisions = [
  "Confirm the restaurant row exists or define the reviewed restaurant fixture mapping.",
  "Map source_id and evidence pointers to public fixture source, capture, source check, review task, and audit event rows.",
  "Confirm public copy, food-only copy, dates, recurrence, restrictions, and freshness.",
  "Assign published_at only in a separate reviewed promotion task and keep hidden_at empty.",
  "Run the existing fixture validator after any future manual fixture edits."
];

function hasEvidence(row: CsvRow): boolean {
  return !isBlank(row.source_capture_id ?? "") || !isBlank(row.direct_confirmation_id ?? "");
}

function hasFreshness(row: CsvRow): boolean {
  return !isBlank(row.next_check_due ?? "") || !isBlank(row.expires_on ?? "");
}

function parseLocalDate(value: string): Date | undefined {
  if (isBlank(value)) {
    return undefined;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if ([year, month, day].some(Number.isNaN)) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function wilmingtonDateParts(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const valueFor = (type: string) => Number(parts.find((part) => part.type === type)?.value);

  return {
    year: valueFor("year"),
    month: valueFor("month"),
    day: valueFor("day")
  };
}

function startOfWilmingtonDay(date: Date): Date {
  const { year, month, day } = wilmingtonDateParts(date);
  return new Date(year, month - 1, day);
}

function isFreshForDate(row: CsvRow, date: Date): boolean {
  const today = startOfWilmingtonDay(date);
  const expiresOn = parseLocalDate(row.expires_on ?? "");
  const nextCheckDue = parseLocalDate(row.next_check_due ?? "");

  if (expiresOn && expiresOn < today) {
    return false;
  }

  if (nextCheckDue && nextCheckDue < today) {
    return false;
  }

  return Boolean(expiresOn || nextCheckDue);
}

function toTimeWindow(start: string, end: string): string {
  if (start && end) {
    return `${formatTime(start)}-${formatTime(end)}`;
  }

  if (start) {
    return `Starts ${formatTime(start)}`;
  }

  if (end) {
    return `Until ${formatTime(end)}`;
  }

  return "N/A";
}

function formatTime(value: string): string {
  const [hourText, minuteText = "0"] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return value;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 || 12;
  const minuteSuffix = minute === 0 ? "" : `:${minute.toString().padStart(2, "0")}`;

  return `${twelveHour}${minuteSuffix} ${period}`;
}

export function getOperatingDate(): Date {
  if (process.env.NODE_ENV !== "production" && process.env.DEAL_FINDER_OPERATING_DATE) {
    const overrideDate = parseLocalDate(process.env.DEAL_FINDER_OPERATING_DATE);

    if (overrideDate) {
      return overrideDate;
    }
  }

  return new Date();
}

export function weekdayName(date = getOperatingDate()): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "America/New_York"
  }).format(date);
}

export function shortDate(date = getOperatingDate()): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York"
  }).format(date);
}

function formatDateLabel(value: string): string {
  const date = parseLocalDate(value);

  if (!date) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York"
  }).format(date);
}

function publicAssetUrl(value: string): string {
  if (!value) {
    return "";
  }

  const publicPrefix = "app/public/";
  if (value.startsWith(publicPrefix)) {
    return `/${value.slice(publicPrefix.length)}`;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return "";
}

function valueRunsOnDay(daysAvailable: string, day: string): boolean {
  const normalizedDay = day.toLowerCase();
  const values = daysAvailable
    .split(/[;,]/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (values.includes("daily") || values.includes("every day")) {
    return true;
  }

  if (values.includes("weekdays") && !["saturday", "sunday"].includes(normalizedDay)) {
    return true;
  }

  return values.includes(normalizedDay);
}

function formatDaysAvailableLabel(daysAvailable: string): string {
  const values = daysAvailable
    .split(/[;,]/)
    .map((value) => value.trim())
    .filter(Boolean);
  const normalizedValues = new Set(values.map((value) => value.toLowerCase()));
  const runsAllWeek = publicDealDayOptions.every((day) => valueRunsOnDay(daysAvailable, day));
  const runsWeekdays = publicDealDayOptions
    .filter((day) => day !== "Saturday" && day !== "Sunday")
    .every((day) => valueRunsOnDay(daysAvailable, day));
  const runsWeekend = ["Saturday", "Sunday"].some((day) => valueRunsOnDay(daysAvailable, day));

  if (normalizedValues.has("daily") || normalizedValues.has("every day") || runsAllWeek) {
    return "Daily";
  }

  if (normalizedValues.has("weekdays") || (runsWeekdays && !runsWeekend)) {
    return "Weekdays";
  }

  return values.join(" / ");
}

function classifyDealSchedule(daysAvailable: string) {
  const values = daysAvailable
    .split(/[;,]/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const normalizedValues = new Set(values);
  const matchingDays = publicDealDayOptions.filter((day) => valueRunsOnDay(daysAvailable, day));
  const recurring =
    normalizedValues.has("daily") ||
    normalizedValues.has("every day") ||
    normalizedValues.has("weekdays") ||
    matchingDays.length !== 1;
  const recurringLabel =
    normalizedValues.has("daily") || normalizedValues.has("every day")
      ? "Daily"
      : normalizedValues.has("weekdays")
        ? "Weekdays"
        : "Multiple days";

  return {
    scheduleKind: recurring ? "recurring" as const : "single_day" as const,
    scheduleLabel: recurring ? recurringLabel : `${matchingDays[0]} special`
  };
}

export function dealRunsOnPublicDay(deal: PublicDeal, day: string): boolean {
  return valueRunsOnDay(deal.daysAvailable, day);
}

export function summarizePublicDealsByDay(deals: PublicDeal[]): PublicDealDayCount[] {
  return publicDealDayOptions.map((day) => ({
    day,
    count: deals.filter((deal) => dealRunsOnPublicDay(deal, day)).length
  }));
}

export function summarizePublicDealsByArea(deals: PublicDeal[]): PublicDealAreaCount[] {
  const counts = new Map<string, number>();

  deals.forEach((deal) => {
    counts.set(deal.areaGroup, (counts.get(deal.areaGroup) ?? 0) + 1);
  });

  const rankByArea = new Map([...publicAreaGroupOptions, southportAreaGroup].map((area, index) => [area, index]));

  return Array.from(counts.entries() as Iterable<[PublicAreaGroup, number]>)
    .map(([area, count]) => ({ area, count }))
    .sort((left, right) => (rankByArea.get(left.area) ?? 99) - (rankByArea.get(right.area) ?? 99));
}

function areaGroupForLocation(value: string, restaurantName = ""): PublicAreaGroup {
  const normalized = `${value} ${restaurantName}`.toLowerCase();

  if (normalized.includes("monkey junction")) {
    return "Monkey Junction";
  }

  if (
    normalized.includes("college") ||
    normalized.includes("oleander") ||
    normalized.includes("uncw") ||
    normalized.includes("racine")
  ) {
    return "College Rd / UNCW";
  }

  if (
    normalized.includes("south front") ||
    normalized.includes("greenfield") ||
    normalized.includes("cargo district")
  ) {
    return "South Front";
  }

  if (
    normalized.includes("downtown") ||
    normalized.includes("castle street") ||
    normalized.includes("brooklyn arts") ||
    normalized.includes("riverwalk") ||
    normalized.includes("riverfront")
  ) {
    return "Downtown";
  }

  if (
    normalized.includes("mayfaire") ||
    normalized.includes("forum") ||
    normalized.includes("ogden") ||
    normalized.includes("north market") ||
    normalized.includes("military cutoff") ||
    normalized.includes("eastwood") ||
    normalized.includes("wrightsville beach") ||
    normalized.includes("porters neck") ||
    normalized.includes("davis community") ||
    normalized.includes("bridgewater wines")
  ) {
    return "Mayfaire/Ogden";
  }

  if (normalized.includes("carolina beach")) {
    return "Carolina Beach";
  }

  if (
    normalized.includes("south wilmington") ||
    normalized.includes("independence") ||
    normalized.includes("shipyard") ||
    normalized.includes("long leaf mall") ||
    normalized.includes("masonboro")
  ) {
    return "South Wilmington";
  }

  if (
    normalized.includes("southport") ||
    normalized.includes("oak island")
  ) {
    return southportAreaGroup;
  }

  if (normalized.includes("islands fresh mex")) {
    return "Monkey Junction";
  }

  if (normalized.includes("true blue butcher & barrel")) {
    return "South Front";
  }

  return "Other Wilmington";
}

function sourceGapAreaGroupForLocation(value: string, restaurantName = ""): SourceGapAreaGroup {
  const normalized = `${value} ${restaurantName}`.toLowerCase();

  if (normalized.includes("carolina beach")) {
    return "Carolina Beach";
  }

  if (normalized.includes("wrightsville beach")) {
    return "Wrightsville / Boundary Review";
  }

  if (normalized.includes("porters neck")) {
    return "Porters Neck";
  }

  return areaGroupForLocation(value, restaurantName);
}

export function passesPublicDealFilter(row: CsvRow, date = getOperatingDate()): boolean {
  const workflowStatus = row.workflow_status ?? "";

  return (
    isTrue(row.mvp_publish_eligible ?? "") &&
    isTrue(row.public_copy_approved ?? "") &&
    (workflowStatus === "approved" || workflowStatus === "approved_with_uncertainty") &&
    row.confidence_status === "verified" &&
    row.review_decision === "approved" &&
    !isBlank(row.published_at ?? "") &&
    isBlank(row.hidden_at ?? "") &&
    (row.conflict_detected ?? "false").toLowerCase() === "false" &&
    (row.is_live_data ?? "false").toLowerCase() === "false" &&
    !isBlank(row.restaurant_id ?? "") &&
    !isBlank(row.source_id ?? "") &&
    !isBlank(row.review_task_id ?? "") &&
    hasEvidence(row) &&
    hasFreshness(row) &&
    isFreshForDate(row, date)
  );
}

function mapDeal(row: CsvRow, restaurantsById: Map<string, CsvRow>): PublicDeal {
  const restaurant = restaurantsById.get(row.restaurant_id);
  const freshnessDate = row.expires_on || row.next_check_due;
  const schedule = classifyDealSchedule(row.days_available);

  return {
    dealId: row.deal_id,
    restaurantId: row.restaurant_id,
    restaurantName: row.restaurant_name,
    neighborhood: restaurant?.neighborhood ?? "",
    area: restaurant?.neighborhood || "Wilmington",
    areaGroup: areaGroupForLocation(restaurant?.neighborhood ?? "", row.restaurant_name),
    address: restaurant?.address ?? "",
    publicTitle: row.public_title,
    publicDescription: row.public_description,
    dealType: row.deal_type,
    price: row.price || row.discount,
    daysAvailable: row.days_available,
    daysAvailableLabel: formatDaysAvailableLabel(row.days_available),
    scheduleKind: schedule.scheduleKind,
    scheduleLabel: schedule.scheduleLabel,
    startTime: row.start_time,
    endTime: row.end_time,
    timeWindow: toTimeWindow(row.start_time, row.end_time),
    sourceUrl: row.source_url,
    sourceName: row.source_name,
    sourceTier: row.source_tier,
    sourceDisplayName: row.source_name || "Official source",
    evidenceLabel: row.direct_confirmation_id ? "Restaurant confirmed" : "Proof checked",
    evidenceCapturedAt: row.evidence_captured_at,
    evidenceSummary: row.evidence_summary,
    evidenceUrlOrPath: row.evidence_url_or_path,
    freshnessLabel: freshnessDate ? `Checked through ${formatDateLabel(freshnessDate)}` : "Check date missing",
    lastVerifiedAt: row.last_verified_at,
    lastVerifiedLabel: formatDateLabel(row.last_verified_at),
    nextCheckDue: row.next_check_due,
    expiresOn: row.expires_on,
    archiveUrlOrPath: row.archive_url_or_path,
    restrictionNotes: row.restriction_notes,
    screenshotPath: row.screenshot_path,
    screenshotUrl: publicAssetUrl(row.screenshot_path),
    sourceQuote: row.source_quote,
    contentHash: row.content_hash,
    dineIn: isTrue(row.dine_in ?? ""),
    takeout: isTrue(row.takeout ?? ""),
    delivery: isTrue(row.delivery ?? ""),
    prototypeNotice: row.prototype_notice
  };
}

export async function getPublicDeals(): Promise<PublicDeal[]> {
  return getPublicDealsForMarket("main");
}

async function getPublicDealsForMarket(market: PublicMarket): Promise<PublicDeal[]> {
  const [dealRows, restaurantRows] = await Promise.all([
    readCsv(publicDealsPath),
    readCsv(restaurantsPath)
  ]);

  const restaurantsById = new Map(restaurantRows.map((row) => [row.restaurant_id, row]));

  return dealRows
    .filter((row) => passesPublicDealRuntimeFilter(row, restaurantsById, undefined, market))
    .map((row) => mapDeal(row, restaurantsById));
}

export async function getSouthportDeals(): Promise<PublicDeal[]> {
  return getPublicDealsForMarket("southport");
}

export async function getAllReviewedPrototypeDeals(): Promise<PublicDeal[]> {
  return getPublicDealsForMarket("all");
}

export async function getPublicTonightDeals(date = getOperatingDate()): Promise<PublicDeal[]> {
  const day = weekdayName(date);
  const rows = await readCsv(publicDealsPath);
  const restaurantRows = await readCsv(restaurantsPath);
  const restaurantsById = new Map(restaurantRows.map((row) => [row.restaurant_id, row]));

  return rows
    .filter((row) =>
      passesPublicDealRuntimeFilter(row, restaurantsById, date, "main") &&
      valueRunsOnDay(row.days_available ?? "", day)
    )
    .map((row) => mapDeal(row, restaurantsById));
}

export async function getPublicDealById(dealId: string, market: PublicMarket = "main"): Promise<PublicDeal | undefined> {
  const deals = await getPublicDealsForMarket(market);
  return deals.find((deal) => deal.dealId === dealId);
}

function uniqueDealDays(deals: PublicDeal[]): string[] {
  if (deals.some((deal) => publicDealDayOptions.every((day) => valueRunsOnDay(deal.daysAvailable, day)))) {
    return ["All week"];
  }

  return publicDealDayOptions.filter((day) => deals.some((deal) => valueRunsOnDay(deal.daysAvailable, day)));
}

function canonicalRestaurantKey(row: CsvRow): string {
  const name = (row.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const address = (row.address ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return address ? `${name}|${address}` : name;
}

function groupRestaurantRows(rows: CsvRow[]): CsvRow[][] {
  const groups = new Map<string, CsvRow[]>();

  rows.forEach((row) => {
    const key = canonicalRestaurantKey(row);
    const group = groups.get(key) ?? [];
    group.push(row);
    groups.set(key, group);
  });

  return Array.from(groups.values());
}

function dealBelongsToRestaurant(deal: PublicDeal, restaurantIds: string[]) {
  return restaurantIds.includes(deal.restaurantId);
}

function phoneHref(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `tel:+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `tel:+${digits}`;
  }

  return "";
}

function mapRestaurant(row: CsvRow, deals: PublicDeal[], restaurantIds = [row.restaurant_id]): RestaurantSummary {
  const restaurantDeals = deals.filter((deal) => dealBelongsToRestaurant(deal, restaurantIds));

  return {
    restaurantId: row.restaurant_id,
    restaurantIds,
    name: row.name,
    neighborhood: row.neighborhood,
    areaGroup: areaGroupForLocation(row.neighborhood, row.name),
    address: row.address,
    phone: row.phone,
    phoneHref: phoneHref(row.phone),
    website: row.official_website,
    cuisine: row.cuisine,
    tags: row.tags,
    status: row.status,
    lastChecked: row.last_checked,
    publicDealCount: restaurantDeals.length,
    publicDealDays: uniqueDealDays(restaurantDeals)
  };
}

function restaurantMatchesMarket(row: CsvRow, market: PublicMarket): boolean {
  if (market === "main") {
    return row.city === "Wilmington" || row.city === "Carolina Beach";
  }

  if (market === "southport") {
    return row.city === "Southport" || row.city === "Oak Island";
  }

  return row.city === "Wilmington" || row.city === "Carolina Beach" || row.city === "Southport" || row.city === "Oak Island";
}

function passesPublicRestaurantFilter(row: CsvRow, market: PublicMarket = "main"): boolean {
  return (
    restaurantMatchesMarket(row, market) &&
    row.state === "NC" &&
    row.status === "active" &&
    row.fixture_data_class === "verified_static" &&
    (row.is_live_data ?? "false").toLowerCase() === "false" &&
    !isBlank(row.prototype_notice ?? "")
  );
}

function isPublicRestaurantHold(row: CsvRow): boolean {
  const tags = (row.tags ?? "")
    .split(";")
    .map((tag) => tag.trim().toLowerCase());

  return tags.includes("public_hold") || (row.notes ?? "").toLowerCase().includes("public hold");
}

function passesPublicDealRuntimeFilter(
  row: CsvRow,
  restaurantsById: Map<string, CsvRow>,
  date?: Date,
  market: PublicMarket = "main"
): boolean {
  const restaurant = restaurantsById.get(row.restaurant_id);
  const dealPasses = date ? passesPublicDealFilter(row, date) : passesPublicDealFilter(row);

  return Boolean(
    dealPasses &&
    restaurant &&
    passesPublicRestaurantFilter(restaurant, market) &&
    !isPublicRestaurantHold(restaurant)
  );
}

function passesReviewedDealOpsGate(row: CsvRow): boolean {
  const workflowStatus = row.workflow_status ?? "";

  return (
    isTrue(row.mvp_publish_eligible ?? "") &&
    isTrue(row.public_copy_approved ?? "") &&
    (workflowStatus === "approved" || workflowStatus === "approved_with_uncertainty" || workflowStatus === "needs_recheck") &&
    row.confidence_status === "verified" &&
    row.review_decision === "approved" &&
    !isBlank(row.published_at ?? "") &&
    (row.is_live_data ?? "false").toLowerCase() === "false" &&
    !isBlank(row.restaurant_id ?? "") &&
    !isBlank(row.source_id ?? "") &&
    !isBlank(row.review_task_id ?? "") &&
    hasEvidence(row) &&
    hasFreshness(row)
  );
}

async function getRestaurantsForMarket(market: PublicMarket): Promise<RestaurantSummary[]> {
  const [restaurantRows, deals] = await Promise.all([
    readCsv(restaurantsPath),
    getPublicDealsForMarket(market)
  ]);

  const publicRows = restaurantRows.filter((row) => passesPublicRestaurantFilter(row, market) && !isPublicRestaurantHold(row));

  return groupRestaurantRows(publicRows)
    .map((rows) => mapRestaurant(rows[0], deals, rows.map((row) => row.restaurant_id)))
    .sort(
      (left, right) =>
        right.publicDealCount - left.publicDealCount ||
        left.name.localeCompare(right.name)
    );
}

export async function getRestaurants(): Promise<RestaurantSummary[]> {
  return getRestaurantsForMarket("main");
}

export async function getSouthportRestaurants(): Promise<RestaurantSummary[]> {
  return getRestaurantsForMarket("southport");
}

export async function getRestaurantById(
  restaurantId: string,
  market: PublicMarket = "main"
): Promise<RestaurantDetail | undefined> {
  const [restaurantRows, deals] = await Promise.all([
    readCsv(restaurantsPath),
    getPublicDealsForMarket(market)
  ]);
  const publicRows = restaurantRows.filter((row) => passesPublicRestaurantFilter(row, market) && !isPublicRestaurantHold(row));
  const group = groupRestaurantRows(publicRows).find((rows) =>
    rows.some((restaurant) => restaurant.restaurant_id === restaurantId)
  );
  const row = group?.[0];

  if (!row) {
    return undefined;
  }

  const restaurantIds = group.map((restaurant) => restaurant.restaurant_id);
  const restaurantDeals = deals.filter((deal) => dealBelongsToRestaurant(deal, restaurantIds));

  return {
    ...mapRestaurant(row, deals, restaurantIds),
    deals: restaurantDeals
  };
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleFromSlug(value: string): string {
  return value
    .replace(/-\d{4}-\d{2}-\d{2}$/, "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function researchIntakeDirectories(): string[] {
  if (!existsSync(researchIntakeRootPath)) {
    return [];
  }

  return readdirSync(researchIntakeRootPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "example-area")
    .map((entry) => path.join(researchIntakeRootPath, entry.name))
    .filter((directory) => existsSync(path.join(directory, "deal-intake.csv")))
    .sort((left, right) => path.basename(left).localeCompare(path.basename(right)));
}

function researchIntakeAreaName(directory: string): string {
  const fallback = titleFromSlug(path.basename(directory));
  const areaBriefPath = path.join(directory, "area_brief.json");

  if (!existsSync(areaBriefPath)) {
    return fallback;
  }

  try {
    const brief = JSON.parse(readFileSync(areaBriefPath, "utf8")) as { area_name?: string };
    return brief.area_name || fallback;
  } catch {
    return fallback;
  }
}

function isClosedResearchReviewRow(row: CsvRow): boolean {
  // Approved intake rows stay open until a separate reviewed promotion task maps
  // them into public fixtures and assigns published_at.
  return ["rejected", "expired", "superseded"].includes(row.workflow_status ?? "") ||
    row.review_decision === "rejected";
}

function researchCandidateId(directory: string, row: CsvRow, index: number): string {
  return row.candidate_id || `intake-${slug(path.basename(directory))}-${index + 2}`;
}

async function readResearchIntakeRows(fileName: string): Promise<Array<{ directory: string; areaName: string; rows: CsvRow[] }>> {
  const directories = researchIntakeDirectories();

  return Promise.all(
    directories.map(async (directory) => {
      const filePath = path.join(directory, fileName);
      const rows = existsSync(filePath) ? await readCsv(filePath) : [];

      return {
        directory,
        areaName: researchIntakeAreaName(directory),
        rows
      };
    })
  );
}

function candidateId(row: CsvRow): string {
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

export async function getReviewCandidates(): Promise<ReviewCandidate[]> {
  const [candidateRows, reviewTaskRows] = await Promise.all([
    readCsv(seedCandidatesPath),
    readCsv(seedReviewTasksPath)
  ]);

  const tasksByCandidate = new Map(
    reviewTaskRows.map((task) => [task.related_id, task])
  );

  return candidateRows
    .filter((row) => row.status === "verified" || row.status === "needs_review")
    .map((row) => {
      const id = candidateId(row);
      const task = tasksByCandidate.get(id);

      return {
        candidateId: id,
        restaurantName: row.restaurant_name,
        dealTitle: row.deal_title,
        dealDay: row.deal_day,
        timeWindow: toTimeWindow(row.start_time, row.end_time),
        price: row.price,
        category: row.deal_category,
        status: row.status,
        confidence: row.confidence,
        needsAttention: row.status === "needs_review",
        sourceName: row.source_name,
        sourceUrl: row.source_url,
        lastVerified: row.last_verified,
        restrictions: row.restrictions,
        notes: row.notes,
        reviewTask: task
          ? {
              taskId: task.review_task_id,
              priority: task.priority,
              status: task.status,
              nextAction: task.next_action,
              nextActionDue: task.next_action_due,
              copyStatus: task.public_copy_approval_status,
              foodCopyCheck: task.food_alcohol_copy_check,
              riskFlags: task.risk_flags
            }
          : undefined
      };
    });
}

export async function getResearchReviewCandidates(): Promise<ReviewCandidate[]> {
  const [dealIntakes, reviewTaskIntakes] = await Promise.all([
    readResearchIntakeRows("deal-intake.csv"),
    readResearchIntakeRows("review-tasks.csv")
  ]);
  const tasksByCandidate = new Map<string, CsvRow>();

  reviewTaskIntakes.forEach((intake) => {
    intake.rows.forEach((task) => {
      const folder = path.basename(intake.directory);
      tasksByCandidate.set(`${folder}:${task.related_id}`, task);
    });
  });

  return dealIntakes
    .flatMap((intake) => {
      const folder = path.basename(intake.directory);

      return intake.rows
        .filter((row) => !isClosedResearchReviewRow(row))
        .map((row, index) => {
          const id = researchCandidateId(intake.directory, row, index);
          const task = tasksByCandidate.get(`${folder}:${id}`);
          const readiness = promotionReadiness(row);

          return {
            dealId: row.deal_id,
            candidateId: id,
            restaurantId: row.restaurant_id,
            restaurantName: row.restaurant_name,
            dealTitle: row.deal_title,
            dealDescription: row.deal_description,
            publicTitle: row.public_title,
            publicDescription: row.public_description,
            dealDay: row.days_available || "Schedule needs review",
            timeWindow: toTimeWindow(row.start_time, row.end_time),
            price: row.price || row.discount,
            category: row.deal_type,
            status: row.workflow_status || "needs_review",
            confidence: row.confidence_status || "unverified",
            needsAttention: true,
            sourceId: row.source_id,
            sourceName: row.source_name || row.source_tier || "Research intake source",
            sourceUrl: row.source_url,
            sourceTier: row.source_tier,
            evidenceType: row.evidence_type,
            evidenceCapturedAt: row.evidence_captured_at,
            evidenceSummary: row.evidence_summary,
            sourceQuote: row.source_quote,
            contentHash: row.content_hash,
            lastVerified: row.last_verified_at || row.evidence_captured_at || row.updated_at || row.created_at,
            restrictions: row.publish_block_reason || row.restriction_notes || row.uncertainty_flags || "Review required before public use.",
            notes: row.validation_notes || row.evidence_summary || row.deal_description,
            areaName: intake.areaName,
            origin: "research_intake" as const,
            intakeFolder: folder,
            publishBlockReason: row.publish_block_reason,
            locationScopeStatus: row.location_scope_status,
            locationEvidence: row.location_evidence,
            sourceCaptureId: row.source_capture_id || row.direct_confirmation_id,
            sourceCheckId: row.source_check_id,
            directConfirmationId: row.direct_confirmation_id,
            evidencePath: row.evidence_url_or_path || row.archive_url_or_path || row.screenshot_path,
            archivePath: row.archive_url_or_path,
            screenshotPath: row.screenshot_path,
            nextCheckDue: row.next_check_due,
            expiresOn: row.expires_on,
            reviewReason: row.review_reason,
            reviewDecision: row.review_decision,
            decisionReason: row.decision_reason,
            reviewedBy: row.reviewed_by,
            reviewedAt: row.reviewed_at,
            uncertaintyFlags: row.uncertainty_flags,
            validationNotes: row.validation_notes,
            alcoholClassification: row.alcohol_classification,
            fixtureDataClass: row.fixture_data_class,
            isLiveData: row.is_live_data,
            prototypeNotice: row.prototype_notice,
            mvpPublishEligible: row.mvp_publish_eligible,
            publicCopyApproved: row.public_copy_approved,
            conflictDetected: row.conflict_detected,
            serviceModeSummary: serviceModeSummary(row),
            publicGateSummary: publicGateSummary(row),
            promotionBlockers: readiness.blockers,
            promotionFieldsNeeded: readiness.fieldsNeeded,
            reviewTask: task
              ? {
                  taskId: task.review_task_id,
                  priority: task.priority,
                  status: task.status,
                  nextAction: task.next_action,
                  nextActionDue: task.next_action_due,
                  copyStatus: task.public_copy_approval_status,
                  foodCopyCheck: task.food_alcohol_copy_check,
                  riskFlags: task.risk_flags
                }
              : undefined
          };
        });
    })
    .sort((left, right) => {
      const priorityRank: Record<string, number> = { critical: 0, high: 1, normal: 2, low: 3 };
      const leftRank = priorityRank[left.reviewTask?.priority ?? "normal"] ?? 2;
      const rightRank = priorityRank[right.reviewTask?.priority ?? "normal"] ?? 2;

      return leftRank - rightRank ||
        (left.areaName ?? "").localeCompare(right.areaName ?? "") ||
        left.restaurantName.localeCompare(right.restaurantName);
    });
}

export async function getOpenReviewCandidates(): Promise<ReviewCandidate[]> {
  const [seedCandidates, researchCandidates] = await Promise.all([
    getReviewCandidates(),
    getResearchReviewCandidates()
  ]);
  const candidates = [...seedCandidates, ...researchCandidates];
  const priorityRank: Record<string, number> = { critical: 0, high: 1, normal: 2, low: 3 };

  return candidates
    .filter(
      (candidate) => candidate.needsAttention || candidate.reviewTask?.status === "open"
    )
    .sort((left, right) => {
      const leftRank = priorityRank[left.reviewTask?.priority ?? "normal"] ?? 2;
      const rightRank = priorityRank[right.reviewTask?.priority ?? "normal"] ?? 2;
      return leftRank - rightRank || left.restaurantName.localeCompare(right.restaurantName);
    });
}

export async function getOpenReviewCandidateById(candidateIdToFind: string): Promise<ReviewCandidate | undefined> {
  const candidates = await getOpenReviewCandidates();
  return candidates.find((candidate) => candidate.candidateId === candidateIdToFind);
}

export async function getReviewCandidateDetail(candidateIdToFind: string): Promise<ReviewCandidateDetail | undefined> {
  const candidate = await getOpenReviewCandidateById(candidateIdToFind);

  if (!candidate) {
    return undefined;
  }

  return {
    ...candidate,
    manualMappingDecisions
  };
}

export async function getPrototypeStats() {
  const [publicRows, restaurantRows, candidateRows, reviewTaskRows] = await Promise.all([
    readCsv(publicDealsPath),
    readCsv(restaurantsPath),
    readCsv(seedCandidatesPath),
    readCsv(seedReviewTasksPath)
  ]);
  const restaurantsById = new Map(restaurantRows.map((row) => [row.restaurant_id, row]));

  return {
    publicRows: publicRows.length,
    publicDealsPassingFilter: publicRows.filter((row) => passesPublicDealRuntimeFilter(row, restaurantsById)).length,
    sourceBackedCandidates: candidateRows.filter((row) => row.status === "verified").length,
    openReviewTasks: reviewTaskRows.filter((row) => row.status === "open").length
  };
}

export async function getSourceGaps(): Promise<SourceGap[]> {
  const [sourceRows, candidateRows] = await Promise.all([
    readCsv(seedRestaurantSourcesPath),
    readCsv(seedCandidatesPath)
  ]);

  const seedGaps = sourceRows
    .map((source) => {
      const candidates = candidateRows.filter(
        (candidate) => candidate.restaurant_name === source.restaurant_name
      );
      const needsReview = candidates.filter((candidate) => candidate.status === "needs_review");
      const verified = candidates.filter((candidate) => candidate.status === "verified");
      const blockers: string[] = [];

      if (!source.primary_source_url) {
        blockers.push("missing official source URL");
      }

      if (source.source_status !== "verified") {
        blockers.push(`source status ${source.source_status}`);
      }

      if (source.manual_review_required === "yes") {
        blockers.push("manual review required");
      }

      if (needsReview.length > 0) {
        blockers.push(`${needsReview.length} candidate${needsReview.length === 1 ? "" : "s"} need review`);
      }

      if (source.notes.toLowerCase().includes("alcohol")) {
        blockers.push("food-only copy risk");
      }

      if (source.notes.toLowerCase().includes("boundary")) {
        blockers.push("location boundary review");
      }

      const priority: SourceGap["priority"] =
        !source.primary_source_url || needsReview.length >= 2
          ? "critical"
          : blockers.length > 1
            ? "high"
            : "normal";

      return {
        restaurantName: source.restaurant_name,
        locationArea: source.location_area,
        areaGroup: sourceGapAreaGroupForLocation(source.location_area, source.restaurant_name),
        primarySourceUrl: source.primary_source_url,
        sourceStatus: source.source_status,
        authorityRank: source.authority_rank,
        scanFrequency: source.scan_frequency,
        candidateCount: candidates.length,
        needsReviewCount: needsReview.length,
        verifiedCandidateCount: verified.length,
        blockers,
        priority,
        notes: source.notes,
        origin: "seed" as const
      };
    })
    .sort((left, right) => {
      const rank: Record<SourceGap["priority"], number> = { critical: 0, high: 1, normal: 2 };
      return rank[left.priority] - rank[right.priority] || right.needsReviewCount - left.needsReviewCount;
    });

  const researchGaps = await getResearchSourceGaps();

  return [...seedGaps, ...researchGaps].sort((left, right) => {
    const rank: Record<SourceGap["priority"], number> = { critical: 0, high: 1, normal: 2 };
    return rank[left.priority] - rank[right.priority] ||
      right.needsReviewCount - left.needsReviewCount ||
      left.restaurantName.localeCompare(right.restaurantName);
  });
}

export async function getResearchSourceGaps(): Promise<SourceGap[]> {
  const [restaurantIntakes, dealIntakes] = await Promise.all([
    readResearchIntakeRows("restaurant-source-list.csv"),
    readResearchIntakeRows("deal-intake.csv")
  ]);
  const dealsByFolderAndRestaurant = new Map<string, CsvRow[]>();

  dealIntakes.forEach((intake) => {
    const folder = path.basename(intake.directory);

    intake.rows.forEach((row) => {
      const key = `${folder}:${row.restaurant_id || row.restaurant_name}`;
      const rows = dealsByFolderAndRestaurant.get(key) ?? [];
      rows.push(row);
      dealsByFolderAndRestaurant.set(key, rows);
    });
  });

  return restaurantIntakes.flatMap((intake) => {
    const folder = path.basename(intake.directory);

    return intake.rows.map((restaurant) => {
      const key = `${folder}:${restaurant.restaurant_id || restaurant.name}`;
      const candidates = dealsByFolderAndRestaurant.get(key) ?? [];
      const openCandidates = candidates.filter((candidate) => !isClosedResearchReviewRow(candidate));
      const verifiedCandidates = candidates.filter((candidate) => candidate.confidence_status === "verified");
      const sourceUrl = restaurant.official_website ||
        restaurant.official_instagram ||
        restaurant.official_facebook ||
        restaurant.ordering_url ||
        restaurant.google_business_url;
      const blockers: string[] = [];

      if (!sourceUrl) {
        blockers.push("missing source URL");
      }

      if (restaurant.status !== "verified") {
        blockers.push(`source status ${restaurant.status || "needs_review"}`);
      }

      if (openCandidates.length > 0) {
        blockers.push(`${openCandidates.length} intake candidate${openCandidates.length === 1 ? "" : "s"} need review`);
      }

      if (candidates.some((candidate) => candidate.location_scope_status === "out_of_scope")) {
        blockers.push("outside current public prototype scope");
      }

      if (candidates.some((candidate) => candidate.publish_block_reason?.includes("no durable capture"))) {
        blockers.push("needs durable capture");
      }

      const priority: SourceGap["priority"] =
        openCandidates.some((candidate) => candidate.workflow_status === "needs_review" && candidate.confidence_status === "probable")
          ? "critical"
          : openCandidates.length > 0
            ? "high"
            : "normal";

      return {
        restaurantName: restaurant.name,
        locationArea: `${restaurant.city || intake.areaName}${restaurant.state ? `, ${restaurant.state}` : ""}`,
        areaGroup: sourceGapAreaGroupForLocation(intake.areaName, restaurant.name),
        primarySourceUrl: sourceUrl,
        sourceStatus: restaurant.status || "needs_review",
        authorityRank: "",
        scanFrequency: "",
        candidateCount: candidates.length,
        needsReviewCount: openCandidates.length,
        verifiedCandidateCount: verifiedCandidates.length,
        blockers,
        priority,
        notes: restaurant.notes || `Research intake from ${intake.areaName}; not public until reviewed fixtures are promoted.`,
        origin: "research_intake" as const,
        intakeFolder: folder
      };
    });
  });
}

function isoDateInWilmington(date: Date): string {
  const { year, month, day } = wilmingtonDateParts(date);
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function daysUntilLocalDate(value: string, date: Date): number | undefined {
  const target = parseLocalDate(value);

  if (!target) {
    return undefined;
  }

  const today = startOfWilmingtonDay(date);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function dueStatus(
  value: string,
  date: Date,
  horizonDays: number
): OpsRecheckItem["dueStatus"] {
  const daysUntilDue = daysUntilLocalDate(value, date);

  if (daysUntilDue === undefined) {
    return "scheduled";
  }

  if (daysUntilDue < 0) {
    return "overdue";
  }

  if (daysUntilDue <= horizonDays) {
    return "due_soon";
  }

  return "scheduled";
}

function evidenceGapsForDeal(row: CsvRow, source?: CsvRow): string[] {
  const gaps: string[] = [];

  if (!hasEvidence(row)) {
    gaps.push("missing source capture or direct confirmation");
  }

  if (isBlank(row.archive_url_or_path ?? "") && isBlank(row.evidence_url_or_path ?? "")) {
    gaps.push("missing durable evidence path");
  }

  if ((source?.volatile_source === "true" || row.evidence_type === "manual_web_review") && isBlank(row.screenshot_path ?? "")) {
    gaps.push("no screenshot capture");
  }

  if (isBlank(row.direct_confirmation_id ?? "")) {
    gaps.push("no direct confirmation on file");
  }

  return gaps;
}

function mapOpsRecheckItem(
  row: CsvRow,
  restaurantsById: Map<string, CsvRow>,
  sourcesById: Map<string, CsvRow>,
  date: Date,
  horizonDays: number
): OpsRecheckItem {
  const dueDate = row.next_check_due || row.expires_on;

  return {
    ...mapDeal(row, restaurantsById),
    dueStatus: dueStatus(dueDate, date, horizonDays),
    daysUntilDue: daysUntilLocalDate(dueDate, date),
    evidenceGaps: evidenceGapsForDeal(row, sourcesById.get(row.source_id))
  };
}

function countRowsDue(rows: CsvRow[], date: Date, horizonDays: number, field = "next_check_due") {
  return rows.filter((row) => dueStatus(row[field] ?? "", date, horizonDays) === "due_soon").length;
}

function countRowsOverdue(rows: CsvRow[], date: Date, field = "next_check_due") {
  return rows.filter((row) => dueStatus(row[field] ?? "", date, 0) === "overdue").length;
}

function isFailedSourceCheck(row: CsvRow): boolean {
  const result = row.result ?? "";
  const access = (row.http_status_or_access_result ?? "").toLowerCase();

  return (
    result === "failed" ||
    result === "conflict" ||
    result === "inaccessible" ||
    access.includes("failed") ||
    access.includes("inaccessible") ||
    access.includes("blocked")
  );
}

function seedCandidateStatusCounts(rows: CsvRow[]) {
  return {
    verified: rows.filter((row) => row.status === "verified").length,
    needsReview: rows.filter((row) => row.status === "needs_review").length,
    terminal: rows.filter((row) => ["rejected", "expired", "superseded"].includes(row.status)).length
  };
}

function manifestDrift(actualCounts: Record<string, number>): OpsManifestDrift[] {
  const manifest = JSON.parse(readFileSync(fixtureManifestPath, "utf8")) as {
    current_seed_counts?: Record<string, number>;
  };
  const expectedCounts = manifest.current_seed_counts ?? {};

  return Object.entries(actualCounts)
    .filter(([key, actual]) => expectedCounts[key] !== undefined && expectedCounts[key] !== actual)
    .map(([key, actual]) => ({
      key,
      expected: expectedCounts[key],
      actual
    }));
}

export async function getOpsDashboard(date = getOperatingDate(), horizonDays = 14): Promise<OpsDashboard> {
  const [
    dealRows,
    restaurantRows,
    sourceRows,
    captureRows,
    sourceCheckRows,
    reviewTaskRows,
    auditRows,
    directConfirmationRows,
    seedCandidateRows,
    seedReviewTaskRows,
    carryoutRows,
    researchDealIntakes,
    researchReviewTaskIntakes,
    sourceGaps,
    openReviewCandidates
  ] = await Promise.all([
    readCsv(publicDealsPath),
    readCsv(restaurantsPath),
    readCsv(sourcesPath),
    readCsv(sourceCapturesPath),
    readCsv(sourceChecksPath),
    readCsv(reviewTasksPath),
    readCsv(auditEventsPath),
    readCsv(directConfirmationsPath),
    readCsv(seedCandidatesPath),
    readCsv(seedReviewTasksPath),
    readCsv(carryoutPlacesPath),
    readResearchIntakeRows("deal-intake.csv"),
    readResearchIntakeRows("review-tasks.csv"),
    getSourceGaps(),
    getOpenReviewCandidates()
  ]);

  const restaurantsById = new Map(restaurantRows.map((row) => [row.restaurant_id, row]));
  const sourcesById = new Map(sourceRows.map((row) => [row.source_id, row]));
  const publicRows = dealRows.filter((row) => passesPublicDealRuntimeFilter(row, restaurantsById, date));
  const reviewedOpsRows = dealRows.filter(passesReviewedDealOpsGate);
  const seedCounts = seedCandidateStatusCounts(seedCandidateRows);
  const researchCandidateRows = researchDealIntakes.flatMap((intake) => intake.rows);
  const researchReviewTaskRows = researchReviewTaskIntakes.flatMap((intake) => intake.rows);
  const day = weekdayName(date);
  const recheckQueue = reviewedOpsRows
    .map((row) => mapOpsRecheckItem(row, restaurantsById, sourcesById, date, horizonDays))
    .filter((deal) => deal.dueStatus !== "scheduled")
    .sort((left, right) => {
      const leftDue = left.daysUntilDue ?? Number.POSITIVE_INFINITY;
      const rightDue = right.daysUntilDue ?? Number.POSITIVE_INFINITY;
      return leftDue - rightDue || left.restaurantName.localeCompare(right.restaurantName);
    });
  const allOpsDeals = reviewedOpsRows.map((row) =>
    mapOpsRecheckItem(row, restaurantsById, sourcesById, date, horizonDays)
  );
  const evidenceGapDeals = allOpsDeals.filter((deal) => deal.evidenceGaps.length > 0);
  const actualCounts = {
    restaurants: restaurantRows.length,
    sources: sourceRows.length,
    source_captures: captureRows.length,
    source_checks: sourceCheckRows.length,
    public_deals: dealRows.length,
    review_tasks: reviewTaskRows.length,
    audit_events: auditRows.length
  };

  return {
    generatedForDate: isoDateInWilmington(date),
    stats: {
      publicRows: dealRows.length,
      publicDealsPassingFilter: publicRows.length,
      tonightVisibleDeals: publicRows.filter((row) => valueRunsOnDay(row.days_available ?? "", day)).length,
      publicBlockedRows: dealRows.length - publicRows.length,
      restaurants: restaurantRows.length,
      sources: sourceRows.length,
      sourceCaptures: captureRows.length,
      sourceChecks: sourceCheckRows.length,
      reviewTasks: reviewTaskRows.length,
      auditEvents: auditRows.length,
      directConfirmations: directConfirmationRows.length,
      openSeedReviewTasks: seedReviewTaskRows.filter((row) => row.status === "open").length,
      criticalSeedReviewTasks: seedReviewTaskRows.filter((row) => row.status === "open" && row.priority === "critical").length,
      highSeedReviewTasks: seedReviewTaskRows.filter((row) => row.status === "open" && row.priority === "high").length,
      verifiedSeedCandidates: seedCounts.verified,
      needsReviewSeedCandidates: seedCounts.needsReview,
      terminalSeedCandidates: seedCounts.terminal,
      researchIntakeBatches: researchDealIntakes.length,
      researchIntakeCandidates: researchCandidateRows.length,
      openResearchIntakeTasks: researchReviewTaskRows.filter((row) => row.status === "open").length,
      verifiedCarryoutPlaces: carryoutRows.filter((row) => row.source_status === "verified").length,
      hiddenCarryoutPlaces: carryoutRows.filter((row) => row.source_status !== "verified").length,
      sourceGapRows: sourceGaps.length,
      criticalSourceGaps: sourceGaps.filter((gap) => gap.priority === "critical").length,
      dueSoonDeals: recheckQueue.filter((deal) => deal.dueStatus === "due_soon").length,
      overdueDeals: recheckQueue.filter((deal) => deal.dueStatus === "overdue").length,
      evidenceGapDeals: evidenceGapDeals.length,
      dueSoonSourceChecks: countRowsDue(sourceCheckRows, date, horizonDays),
      overdueSourceChecks: countRowsOverdue(sourceCheckRows, date),
      failedSourceChecks: sourceCheckRows.filter(isFailedSourceCheck).length
    },
    recheckQueue,
    evidenceGapDeals,
    openReviewCandidates,
    sourceGaps: sourceGaps.slice(0, 8),
    recentAuditEvents: auditRows
      .filter((row) => row.event_type === "deal_published")
      .sort((left, right) => right.event_at.localeCompare(left.event_at))
      .slice(0, 6)
      .map((row) => ({
        auditEventId: row.audit_event_id,
        eventAt: row.event_at,
        actor: row.actor,
        summary: row.summary,
        restaurantId: row.restaurant_id,
        dealId: row.related_deal_id,
        evidenceRef: row.evidence_ref
      })),
    manifestDrift: manifestDrift(actualCounts)
  };
}

export async function getCarryoutPlaces(): Promise<CarryoutPlace[]> {
  const rows = await readCsv(carryoutPlacesPath);

  return rows
    .filter((row) => row.source_status === "verified")
    .map((row) => ({
      placeId: row.place_id,
      restaurantName: row.restaurant_name,
      locationArea: row.location_area,
      address: row.address,
      cuisine: row.cuisine,
      carryoutSignal: row.carryout_signal,
      deliverySignal: row.delivery_signal,
      orderingUrl: row.ordering_url,
      sourceName: row.source_name,
      sourceUrl: row.source_url,
      sourceStatus: row.source_status,
      manualReviewRequired: row.manual_review_required === "yes",
      publicDealStatus: row.public_deal_status,
      notes: row.notes,
      lastChecked: row.last_checked
    }))
    .sort((left, right) => {
      const statusRank = (place: CarryoutPlace) => (place.sourceStatus === "verified" ? 0 : 1);
      return statusRank(left) - statusRank(right) || left.restaurantName.localeCompare(right.restaurantName);
    });
}
