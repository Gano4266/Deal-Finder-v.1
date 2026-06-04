import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateIntakeContract } from "./research-intake-contract.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destinationFiles = [
  "fixtures/prototype/deals.csv",
  "fixtures/prototype/restaurants.csv",
  "fixtures/prototype/sources.csv",
  "fixtures/prototype/source-captures.csv",
  "fixtures/prototype/source-checks.csv",
  "fixtures/prototype/review-tasks.csv",
  "fixtures/prototype/audit-events.csv",
  "fixtures/prototype/fixture-manifest.json"
];

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
const publicFixtureMetadataBlockers = new Set([
  "is_live_data must be false for public prototype fixtures",
  "fixture_data_class must be verified_static for public prototype fixtures",
  "missing prototype_notice required by current fixture validator"
]);

function parseCsvLine(line, label) {
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

  if (inQuotes) {
    throw new Error(`${label}: unterminated quoted CSV field`);
  }

  values.push(current);
  return values;
}

function readCsv(absolutePath, label) {
  const text = fs.readFileSync(absolutePath, "utf8").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();
  if (!text) {
    return { headers: [], rows: [] };
  }

  const [headerLine, ...lines] = text.split("\n");
  const headers = parseCsvLine(headerLine, `${label}: header`);
  const rows = [];

  lines.filter(Boolean).forEach((line, index) => {
    const values = parseCsvLine(line, `${label}: row ${index + 2}`);
    if (values.length !== headers.length) {
      throw new Error(`${label}: row ${index + 2} has ${values.length} fields, expected ${headers.length}`);
    }

    rows.push(Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] ?? ""])));
  });

  return { headers, rows };
}

function value(row, field) {
  return row[field]?.trim() ?? "";
}

function isTrue(input) {
  return input.trim().toLowerCase() === "true";
}

function parseDate(valueToParse) {
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

function hasAny(row, fields) {
  return fields.some((field) => Boolean(value(row, field)));
}

function rowLabel(row, index) {
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

function sourceTierIsPublishable(row) {
  const sourceTier = value(row, "source_tier");
  return officialSourceTiers.has(sourceTier);
}

function promotionBlockers(row, today) {
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

function loadDealRows(intakeDir) {
  const dealPath = path.join(intakeDir, "deal-intake.csv");
  if (!fs.existsSync(dealPath)) {
    return { rows: [], missingDealIntake: true };
  }

  return { ...readCsv(dealPath, "deal-intake.csv"), missingDealIntake: false };
}

function buildDryRun(intakeDir) {
  const { rows, missingDealIntake } = loadDealRows(intakeDir);
  const promotable = [];
  const blocked = [];
  const today = todayInWilmington();

  rows.forEach((row, index) => {
    const result = promotionBlockers(row, today);
    const entry = {
      row: index + 2,
      id: rowLabel(row, index),
      restaurant_id: value(row, "restaurant_id"),
      deal_title: value(row, "deal_title")
    };

    if (result.blockers.length === 0) {
      promotable.push(entry);
    } else {
      blocked.push({
        ...entry,
        blockers: result.blockers,
        fields_needed_before_manual_promotion: result.fieldsNeeded
      });
    }
  });

  return {
    intakeFolder: path.relative(repoRoot, intakeDir),
    dryRunOnly: true,
    missingDealIntake,
    totalRowsScanned: rows.length,
    theoreticallyPromotableRows: promotable,
    blockedRows: blocked,
    destinationFilesThatWouldNeedManualReviewedUpdates: destinationFiles,
    manualMappingDecisionsRequired: [
      "Confirm each restaurant row exists or define the reviewed restaurant fixture mapping.",
      "Map source_id and evidence pointers to reviewed public fixture source, capture, source check, review task, and audit event rows.",
      "Confirm cross-fixture relationships: candidate, restaurant, source, capture, check, review task, and audit event references.",
      "Confirm public copy, food-only or approved food-safe copy, dates, recurrence, restrictions, and freshness.",
      "Assign published_at and ensure hidden_at remains empty only in a separate reviewed promotion task.",
      "Run the existing fixture validator after any future manual fixture edits."
    ],
    note: "Dry run only. This script does not approve rows, promote deals, write fixtures, or hydrate public routes."
  };
}

function buildPromotionReadiness(report, contract) {
  const fixtureMetadataOnlyRows = report.blockedRows.filter((row) =>
    row.blockers.length > 0 && row.blockers.every((blocker) => publicFixtureMetadataBlockers.has(blocker))
  );

  const evidenceOrReviewBlockedRows = report.blockedRows.length - fixtureMetadataOnlyRows.length;
  const safeNextAction = fixtureMetadataOnlyRows.length > 0
    ? "Prepare reviewed fixture metadata for approved rows, then rerun dry-run before any manual fixture edits."
    : "Resolve evidence, review, freshness, and public-copy blockers before fixture mapping.";

  return {
    contractClean: contract.failures.length === 0,
    contractWarningCount: contract.warnings.length,
    rowsBlockedOnlyByPublicFixtureMetadata: fixtureMetadataOnlyRows.length,
    rowsBlockedByEvidenceReviewOrCopy: evidenceOrReviewBlockedRows,
    safeNextAction
  };
}

function categorizeBlockedRows(blockedRows) {
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

function printRows(title, rows, formatter) {
  console.log(`\n${title}: ${rows.length}`);
  rows.forEach((row) => console.log(`- ${formatter(row)}`));
}

function printRowIds(title, rows) {
  console.log(`- ${title}: ${rows.length}${rows.length > 0 ? ` (${rows.map((row) => row.id).join(", ")})` : ""}`);
}

function printDryRun(report) {
  console.log(`Research intake promotion dry run: ${report.intakeFolder}`);
  console.log("Dry run only. No fixture edits, approvals, promotions, scraping, or API calls.");

  if (report.missingDealIntake) {
    console.log("\nMissing optional file: deal-intake.csv");
  }

  console.log(`\nTotal rows scanned: ${report.totalRowsScanned}`);

  if (report.promotionReadiness) {
    console.log("\nPromotion readiness");
    console.log(`- Contract clean: ${report.promotionReadiness.contractClean ? "yes" : "no"}`);
    console.log(`- Contract warnings: ${report.promotionReadiness.contractWarningCount}`);
    console.log(`- Rows blocked only by public fixture metadata: ${report.promotionReadiness.rowsBlockedOnlyByPublicFixtureMetadata}`);
    console.log(`- Rows blocked by evidence/review/copy: ${report.promotionReadiness.rowsBlockedByEvidenceReviewOrCopy}`);
    console.log(`- Safe next action: ${report.promotionReadiness.safeNextAction}`);
  }

  if (report.blockerGroups) {
    console.log("\nBlocked row groups");
    printRowIds("metadata-only", report.blockerGroups.metadataOnly);
    printRowIds("evidence/review/copy", report.blockerGroups.evidenceReviewOrCopy);
    printRowIds("service-mode", report.blockerGroups.serviceMode);
    printRowIds("scope", report.blockerGroups.scope);
    printRowIds("AI evidence", report.blockerGroups.aiEvidence);
  }

  printRows(
    "Theoretically promotable rows",
    report.theoreticallyPromotableRows,
    (row) => `${row.id} (${row.row}) ${row.deal_title || "(untitled)"}`
  );

  printRows(
    "Blocked rows",
    report.blockedRows,
    (row) => `${row.id} (${row.row}): ${row.blockers.join("; ")}`
  );

  if (report.blockedRows.length > 0) {
    console.log("\nFields still needed before manual promotion");
    report.blockedRows.forEach((row) => {
      const needed = row.fields_needed_before_manual_promotion.length > 0
        ? row.fields_needed_before_manual_promotion.join(", ")
        : "manual review";
      console.log(`- ${row.id} (${row.row}): ${needed}`);
    });
  }

  console.log("\nDestination files that would eventually need reviewed manual updates");
  report.destinationFilesThatWouldNeedManualReviewedUpdates.forEach((file) => console.log(`- ${file}`));

  console.log("\nManual mapping decisions required first");
  report.manualMappingDecisionsRequired.forEach((decision) => console.log(`- ${decision}`));
}

const intakeArg = process.argv[2];

if (!intakeArg) {
  console.error("Usage: node scripts/dry-run-promote-research-intake.mjs ops/research/intake/[folder-name]");
  process.exit(1);
}

if (process.argv.includes("--write")) {
  console.error("--write is not implemented. This promotion guard is dry-run-only.");
  process.exit(1);
}

const intakeDir = path.resolve(process.cwd(), intakeArg);
if (!fs.existsSync(intakeDir) || !fs.statSync(intakeDir).isDirectory()) {
  console.error(`Research intake folder not found: ${intakeArg}`);
  process.exit(1);
}

const contract = validateIntakeContract(intakeDir);
if (contract.failures.length > 0) {
  console.error(`Research intake contract failed for ${contract.relativePath}:`);
  contract.failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

let report;

try {
  report = buildDryRun(intakeDir);
  report.promotionReadiness = buildPromotionReadiness(report, contract);
  report.blockerGroups = categorizeBlockedRows(report.blockedRows);
} catch (error) {
  console.error(`Research intake dry run failed: ${error.message}`);
  process.exit(1);
}

printDryRun(report);
