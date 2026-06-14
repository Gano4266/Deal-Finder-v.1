import { value } from "./research-intake-contract.mjs";

export const destinationFiles = [
  "fixtures/prototype/deals.csv",
  "fixtures/prototype/restaurants.csv",
  "fixtures/prototype/sources.csv",
  "fixtures/prototype/source-captures.csv",
  "fixtures/prototype/source-checks.csv",
  "fixtures/prototype/review-tasks.csv",
  "fixtures/prototype/audit-events.csv",
  "fixtures/prototype/fixture-manifest.json"
];

export const approvedWorkflowStatuses = new Set(["approved", "approved_with_uncertainty"]);
export const officialSourceTiers = new Set(["tier_1_official", "tier_2_official_social"]);
export const knownSourceTiers = new Set([
  "tier_1_official",
  "tier_2_official_social",
  "tier_3_partner",
  "tier_4_secondary",
  "tier_5_user_reported"
]);

export const publicFixtureMetadataBlockers = new Set([
  "is_live_data must be false for public prototype fixtures",
  "fixture_data_class must be verified_static for public prototype fixtures",
  "missing prototype_notice required by current fixture validator"
]);

export const aiEvidencePattern = /\b(gpt|chatgpt|deep research|ai|llm|language model|openai|claude|gemini|copilot)\b/i;
export const sha256Pattern = /^sha256:[a-f0-9]{64}$/;

export function isTrue(input) {
  return input.trim().toLowerCase() === "true";
}

export function parseDate(valueToParse) {
  if (!valueToParse) {
    return undefined;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(valueToParse)) {
    return undefined;
  }

  const [year, month, day] = valueToParse.split("-").map(Number);
  if ([year, month, day].some(Number.isNaN)) {
    return undefined;
  }

  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return undefined;
  }

  return parsed;
}

export function todayInWilmington() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const valueFor = (type) => Number(parts.find((part) => part.type === type)?.value);
  return new Date(valueFor("year"), valueFor("month") - 1, valueFor("day"));
}

export function hasAny(row, fields) {
  return fields.some((field) => Boolean(value(row, field)));
}

export function publicPromotionRowLabel(row, index) {
  return value(row, "deal_id") || value(row, "candidate_id") || value(row, "restaurant_id") || `row ${index + 2}`;
}

function aiEvidenceText(row) {
  return [
    value(row, "source_name"),
    value(row, "source_url"),
    value(row, "evidence_type"),
    value(row, "evidence_summary"),
    value(row, "source_quote")
  ].join(" ");
}

export function sourceTierIsPublishable(row) {
  return officialSourceTiers.has(value(row, "source_tier"));
}

export function promotionBlockers(row, today = todayInWilmington()) {
  const blockers = [];
  const fieldsNeeded = new Set();
  const sourceTier = value(row, "source_tier");

  function requireField(field, reason = `missing ${field}`) {
    if (!value(row, field)) {
      blockers.push(reason);
      fieldsNeeded.add(field);
    }
  }

  function requireAny(fields, reason) {
    if (!hasAny(row, fields)) {
      blockers.push(reason);
      fields.forEach((field) => fieldsNeeded.add(field));
    }
  }

  if (!approvedWorkflowStatuses.has(value(row, "workflow_status"))) {
    blockers.push("workflow_status is not approved or approved_with_uncertainty");
    fieldsNeeded.add("workflow_status");
  }

  if (value(row, "confidence_status") !== "verified") {
    blockers.push("confidence_status is not verified");
    fieldsNeeded.add("confidence_status");
  }

  if (value(row, "review_decision") !== "approved") {
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

  if (value(row, "conflict_detected") !== "false") {
    blockers.push("conflict_detected must be exactly false");
    fieldsNeeded.add("conflict_detected");
  }

  if (!isTrue(value(row, "public_copy_approved"))) {
    blockers.push("public_copy_approved is not true");
    fieldsNeeded.add("public_copy_approved");
  }

  if (!isTrue(value(row, "mvp_publish_eligible"))) {
    blockers.push("mvp_publish_eligible is not true");
    fieldsNeeded.add("mvp_publish_eligible");
  }

  if (!sourceTier) {
    blockers.push("missing source_tier");
    fieldsNeeded.add("source_tier");
  } else if (!knownSourceTiers.has(sourceTier)) {
    blockers.push(`source_tier is non-canonical: ${sourceTier}`);
    fieldsNeeded.add("source_tier");
  } else if (!sourceTierIsPublishable(row)) {
    blockers.push(`${sourceTier} is not accepted by the current public fixture validator`);
    fieldsNeeded.add("source_tier");
  }

  if (!hasAny(row, ["screenshot_path", "archive_url_or_path", "evidence_url_or_path", "direct_confirmation_id"])) {
    blockers.push("missing durable evidence path or direct_confirmation_id");
    fieldsNeeded.add("screenshot_path");
    fieldsNeeded.add("archive_url_or_path");
    fieldsNeeded.add("evidence_url_or_path");
    fieldsNeeded.add("direct_confirmation_id");
  }

  if (!value(row, "screenshot_path")) {
    blockers.push("missing screenshot_path required by current fixture validator");
    fieldsNeeded.add("screenshot_path");
  }

  if (value(row, "content_hash") && !sha256Pattern.test(value(row, "content_hash"))) {
    blockers.push("content_hash is not sha256:<64 hex chars>");
    fieldsNeeded.add("content_hash");
  }

  if (value(row, "hidden_at")) {
    blockers.push("hidden_at must be blank");
    fieldsNeeded.add("hidden_at");
  }

  if (value(row, "is_live_data") !== "false") {
    blockers.push("is_live_data must be false for public prototype fixtures");
    fieldsNeeded.add("is_live_data");
  }

  if (value(row, "fixture_data_class") !== "verified_static") {
    blockers.push("fixture_data_class must be verified_static for public prototype fixtures");
    fieldsNeeded.add("fixture_data_class");
  }

  if (!value(row, "prototype_notice")) {
    blockers.push("missing prototype_notice required by current fixture validator");
    fieldsNeeded.add("prototype_notice");
  }

  if (value(row, "alcohol_classification") !== "food_only") {
    blockers.push("alcohol_classification must be food_only for public prototype deals");
    fieldsNeeded.add("alcohol_classification");
  }

  const allowedLocationScopes = new Set(["wilmington_confirmed", "pilot_market_confirmed"]);
  if (value(row, "location_scope_status") && !allowedLocationScopes.has(value(row, "location_scope_status"))) {
    blockers.push("location_scope_status is not an approved Wilmington or pilot market scope");
    fieldsNeeded.add("location_scope_status");
  }

  const expiresOn = parseDate(value(row, "expires_on"));
  if (value(row, "expires_on") && !expiresOn) {
    blockers.push("expires_on is not an ISO date");
    fieldsNeeded.add("expires_on");
  } else if (expiresOn && expiresOn < today) {
    blockers.push("expires_on is expired");
    fieldsNeeded.add("expires_on");
  }

  const nextCheckDue = parseDate(value(row, "next_check_due"));
  if (value(row, "next_check_due") && !nextCheckDue) {
    blockers.push("next_check_due is not an ISO date");
    fieldsNeeded.add("next_check_due");
  } else if (nextCheckDue && nextCheckDue < today) {
    blockers.push("next_check_due is overdue");
    fieldsNeeded.add("next_check_due");
  }

  if (aiEvidencePattern.test(aiEvidenceText(row))) {
    blockers.push("row appears to rely on AI/GPT output as evidence");
    fieldsNeeded.add("source_name");
    fieldsNeeded.add("source_quote");
  }

  return {
    blockers,
    fieldsNeeded: [...fieldsNeeded].sort()
  };
}

export function categorizeBlocker(blocker) {
  if (blocker.includes("AI/GPT")) {
    return "AI/discovery-only evidence";
  }

  if (publicFixtureMetadataBlockers.has(blocker)) {
    return "fixture metadata";
  }

  if (blocker.includes("source_tier") || blocker.includes("tier_")) {
    return "source tier";
  }

  if (
    blocker.includes("source") ||
    blocker.includes("evidence") ||
    blocker.includes("screenshot") ||
    blocker.includes("hash") ||
    blocker.includes("capture") ||
    blocker.includes("confirmation")
  ) {
    return "evidence";
  }

  if (blocker.includes("next_check_due") || blocker.includes("expires_on") || blocker.includes("overdue") || blocker.includes("expired")) {
    return "freshness";
  }

  if (blocker.includes("dine_in") || blocker.includes("takeout") || blocker.includes("delivery")) {
    return "service mode";
  }

  if (blocker.includes("location_scope_status")) {
    return "location scope";
  }

  if (
    blocker.includes("public_copy") ||
    blocker.includes("public_title") ||
    blocker.includes("public_description")
  ) {
    return "copy approval";
  }

  if (
    blocker.includes("workflow_status") ||
    blocker.includes("confidence_status") ||
    blocker.includes("review_decision") ||
    blocker.includes("reviewed_") ||
    blocker.includes("review_task") ||
    blocker.includes("deal_id") ||
    blocker.includes("candidate_id") ||
    blocker.includes("restaurant_id") ||
    blocker.includes("decision_reason") ||
    blocker.includes("published_at")
  ) {
    return "review mapping";
  }

  if (
    blocker.includes("mvp_publish_eligible") ||
    blocker.includes("conflict_detected") ||
    blocker.includes("hidden_at") ||
    blocker.includes("alcohol_classification")
  ) {
    return "publication policy";
  }

  return "other";
}

export function categorizeBlockedRows(blockedRows) {
  const metadataOnly = [];
  const serviceMode = [];
  const scope = [];
  const aiEvidence = [];
  const evidenceReviewOrCopy = [];

  blockedRows.forEach((row) => {
    if (row.blockers.length > 0 && row.blockers.every((blocker) => publicFixtureMetadataBlockers.has(blocker))) {
      metadataOnly.push(row);
      return;
    }

    if (row.blockers.some((blocker) => blocker.includes("dine_in") || blocker.includes("takeout") || blocker.includes("delivery"))) {
      serviceMode.push(row);
    }

    if (row.blockers.some((blocker) => blocker.includes("location_scope_status"))) {
      scope.push(row);
    }

    if (row.blockers.some((blocker) => blocker.includes("AI/GPT"))) {
      aiEvidence.push(row);
    }

    evidenceReviewOrCopy.push(row);
  });

  return {
    metadataOnly,
    evidenceReviewOrCopy,
    serviceMode,
    scope,
    aiEvidence
  };
}

export function summarizeBlockerCategories(blockedRows) {
  const categories = new Map();

  blockedRows.forEach((row) => {
    row.blockers.forEach((blocker) => {
      const category = categorizeBlocker(blocker);
      if (!categories.has(category)) {
        categories.set(category, { count: 0, blockers: new Map() });
      }

      const entry = categories.get(category);
      entry.count += 1;
      entry.blockers.set(blocker, (entry.blockers.get(blocker) ?? 0) + 1);
    });
  });

  return [...categories.entries()]
    .map(([category, entry]) => ({
      category,
      count: entry.count,
      blockers: [...entry.blockers.entries()]
        .map(([blocker, count]) => ({ blocker, count }))
        .sort((left, right) => right.count - left.count || left.blocker.localeCompare(right.blocker))
    }))
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category));
}
