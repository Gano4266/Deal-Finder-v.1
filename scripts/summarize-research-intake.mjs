import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateIntakeContract } from "./research-intake-contract.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const intakeFiles = [
  "restaurant-source-list.csv",
  "source-inventory.csv",
  "source-captures.csv",
  "deal-intake.csv",
  "review-tasks.csv"
];

const sourceTierFields = new Set(["source_tier"]);
const confidenceStatusFields = new Set(["confidence_status", "confidence_status_before", "confidence_status_after"]);
const workflowStatusFields = new Set(["workflow_status", "workflow_status_before", "workflow_status_after"]);
const reviewDecisionFields = new Set(["review_decision", "decision"]);
const discoveryOnlyTiers = new Set(["tier_4_secondary", "tier_5_user_reported"]);
const approvalWorkflowStatuses = new Set(["approved", "approved_with_uncertainty"]);

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

function hasAny(row, fields) {
  return fields.some((field) => Boolean(value(row, field)));
}

function rowLabel(row, index) {
  return value(row, "deal_id") ||
    value(row, "candidate_id") ||
    value(row, "review_task_id") ||
    value(row, "source_id") ||
    value(row, "restaurant_id") ||
    `row ${index + 2}`;
}

function increment(counts, key) {
  const normalizedKey = key || "(blank)";
  counts[normalizedKey] = (counts[normalizedKey] ?? 0) + 1;
}

function addCounts(rows, fields, counts) {
  rows.forEach((row) => {
    Object.entries(row).forEach(([field, rawValue]) => {
      if (fields.has(field)) {
        increment(counts, rawValue.trim());
      }
    });
  });
}

function collectMissing(rows, fields, indexOffset = 2) {
  return rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => !hasAny(row, fields))
    .map(({ row, index }) => ({
      row: index + indexOffset,
      id: rowLabel(row, index),
      missingAnyOf: fields
    }));
}

function approvalBlockers(row) {
  const blockers = [];
  const sourceTier = value(row, "source_tier");

  if (!sourceTier) {
    blockers.push("missing source_tier");
  }

  if (!value(row, "source_id")) {
    blockers.push("missing source_id");
  }

  if (!hasAny(row, ["source_capture_id", "direct_confirmation_id"])) {
    blockers.push("missing source_capture_id/direct_confirmation_id");
  }

  if (!value(row, "evidence_captured_at")) {
    blockers.push("missing evidence_captured_at");
  }

  if (!value(row, "source_quote")) {
    blockers.push("missing source_quote");
  }

  if (value(row, "confidence_status") === "unverified") {
    blockers.push("confidence_status is unverified");
  }

  if (!value(row, "confidence_status")) {
    blockers.push("missing confidence_status");
  }

  if (!hasAny(row, ["next_check_due", "expires_on"])) {
    blockers.push("missing next_check_due/expires_on");
  }

  if (value(row, "review_decision") !== "approved") {
    blockers.push("review_decision is not approved");
  }

  if (!value(row, "review_task_id")) {
    blockers.push("missing review_task_id");
  }

  if (!value(row, "reviewed_by")) {
    blockers.push("missing reviewed_by");
  }

  if (!value(row, "reviewed_at")) {
    blockers.push("missing reviewed_at");
  }

  if (isTrue(value(row, "mvp_publish_eligible")) && !isTrue(value(row, "public_copy_approved"))) {
    blockers.push("mvp_publish_eligible=true without public_copy_approved=true");
  }

  if (discoveryOnlyTiers.has(sourceTier) && !value(row, "direct_confirmation_id")) {
    blockers.push(`${sourceTier} needs direct_confirmation_id before approval`);
  }

  if (isTrue(value(row, "conflict_detected"))) {
    blockers.push("conflict_detected=true");
  }

  if (!hasAny(row, ["screenshot_path", "archive_url_or_path", "evidence_url_or_path"])) {
    blockers.push("missing screenshot_path/archive_url_or_path/evidence_url_or_path");
  }

  const missingServiceModeFields = ["dine_in", "takeout", "delivery"].filter((field) => !value(row, field));
  if (missingServiceModeFields.length > 0) {
    blockers.push(`missing service-mode applicability: ${missingServiceModeFields.join(", ")}`);
  }

  return blockers;
}

function structurallyEligibleForReview(row) {
  const workflowStatus = value(row, "workflow_status");
  if (approvalWorkflowStatuses.has(workflowStatus)) {
    return false;
  }

  return Boolean(
    value(row, "restaurant_id") &&
      value(row, "deal_title") &&
      value(row, "source_tier") &&
      (value(row, "source_url") || value(row, "direct_confirmation_id")) &&
      (value(row, "source_quote") || value(row, "evidence_summary")) &&
      !isTrue(value(row, "conflict_detected"))
  );
}

function loadIntake(intakeDir) {
  const files = {};
  const missingFiles = [];

  intakeFiles.forEach((file) => {
    const absolutePath = path.join(intakeDir, file);
    if (!fs.existsSync(absolutePath)) {
      missingFiles.push(file);
      files[file] = { headers: [], rows: [] };
      return;
    }

    files[file] = readCsv(absolutePath, file);
  });

  return { files, missingFiles };
}

function buildSummary(intakeDir) {
  const { files, missingFiles } = loadIntake(intakeDir);
  const restaurantRows = files["restaurant-source-list.csv"].rows;
  const sourceRows = files["source-inventory.csv"].rows;
  const captureRows = files["source-captures.csv"].rows;
  const dealRows = files["deal-intake.csv"].rows;
  const reviewTaskRows = files["review-tasks.csv"].rows;
  const allRows = [...restaurantRows, ...sourceRows, ...captureRows, ...dealRows, ...reviewTaskRows];

  const counts = {
    source_tier: {},
    confidence_status: {},
    workflow_status: {},
    review_decision: {}
  };

  addCounts(allRows, sourceTierFields, counts.source_tier);
  addCounts(allRows, confidenceStatusFields, counts.confidence_status);
  addCounts(allRows, workflowStatusFields, counts.workflow_status);
  addCounts(allRows, reviewDecisionFields, counts.review_decision);

  const tier4Or5Rows = dealRows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => discoveryOnlyTiers.has(value(row, "source_tier")))
    .map(({ row, index }) => ({ row: index + 2, id: rowLabel(row, index), source_tier: value(row, "source_tier") }));

  const structurallyEligibleRows = dealRows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => structurallyEligibleForReview(row))
    .map(({ row, index }) => ({ row: index + 2, id: rowLabel(row, index) }));

  const blockedFromApproval = dealRows
    .map((row, index) => ({ row, index, blockers: approvalBlockers(row) }))
    .filter(({ blockers }) => blockers.length > 0)
    .map(({ row, index, blockers }) => ({ row: index + 2, id: rowLabel(row, index), blockers }));

  return {
    intakeFolder: path.relative(repoRoot, intakeDir),
    missingFiles,
    counts: {
      restaurants: restaurantRows.length,
      sources: sourceRows.length,
      sourceCaptures: captureRows.length,
      dealIntakeRows: dealRows.length,
      reviewTasks: reviewTaskRows.length,
      bySourceTier: counts.source_tier,
      byConfidenceStatus: counts.confidence_status,
      byWorkflowStatus: counts.workflow_status,
      byReviewDecision: counts.review_decision
    },
    issues: {
      missingSourceUrl: collectMissing(dealRows, ["source_url", "direct_confirmation_id"]),
      missingSourceQuote: collectMissing(dealRows, ["source_quote"]),
      missingEvidenceId: collectMissing(dealRows, ["source_capture_id", "direct_confirmation_id"]),
      missingEvidencePath: collectMissing(dealRows, ["screenshot_path", "archive_url_or_path", "evidence_url_or_path"]),
      missingFreshness: collectMissing(dealRows, ["next_check_due", "expires_on"]),
      missingServiceMode: dealRows
        .map((row, index) => ({ row, index }))
        .filter(({ row }) => ["dine_in", "takeout", "delivery"].some((field) => !value(row, field)))
        .map(({ row, index }) => ({
          row: index + 2,
          id: rowLabel(row, index),
          missingFields: ["dine_in", "takeout", "delivery"].filter((field) => !value(row, field))
        })),
      tier4Or5Rows,
      structurallyEligibleRows,
      blockedFromApproval
    },
    note: "Read-only summary only. This report does not approve, publish, promote, or mutate intake rows."
  };
}

function printCounts(title, counts) {
  console.log(`\n${title}`);
  const entries = Object.entries(counts);
  if (entries.length === 0) {
    console.log("- none");
    return;
  }

  entries
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([key, count]) => console.log(`- ${key}: ${count}`));
}

function printRows(title, rows, formatter = (row) => `${row.id} (${row.row})`) {
  console.log(`\n${title}: ${rows.length}`);
  if (rows.length === 0) {
    return;
  }

  rows.forEach((row) => console.log(`- ${formatter(row)}`));
}

function printTextSummary(summary) {
  console.log(`Research intake summary: ${summary.intakeFolder}`);
  console.log("Read-only report. No approvals, promotions, fixture edits, scraping, or API calls.");

  if (summary.missingFiles.length > 0) {
    console.log(`\nMissing optional files: ${summary.missingFiles.join(", ")}`);
  }

  console.log("\nCounts");
  console.log(`- restaurants: ${summary.counts.restaurants}`);
  console.log(`- sources: ${summary.counts.sources}`);
  console.log(`- source captures: ${summary.counts.sourceCaptures}`);
  console.log(`- deal intake rows: ${summary.counts.dealIntakeRows}`);
  console.log(`- review tasks: ${summary.counts.reviewTasks}`);

  printCounts("Count by source_tier", summary.counts.bySourceTier);
  printCounts("Count by confidence_status", summary.counts.byConfidenceStatus);
  printCounts("Count by workflow_status", summary.counts.byWorkflowStatus);
  printCounts("Count by review_decision", summary.counts.byReviewDecision);

  printRows("Rows missing source_url or direct_confirmation_id", summary.issues.missingSourceUrl);
  printRows("Rows missing source_quote", summary.issues.missingSourceQuote);
  printRows("Rows missing source_capture_id or direct_confirmation_id", summary.issues.missingEvidenceId);
  printRows("Rows missing screenshot_path, archive_url_or_path, or evidence_url_or_path", summary.issues.missingEvidencePath);
  printRows("Rows missing next_check_due or expires_on", summary.issues.missingFreshness);
  printRows(
    "Rows missing complete dine_in/takeout/delivery applicability",
    summary.issues.missingServiceMode,
    (row) => `${row.id} (${row.row}): ${row.missingFields.join(", ")}`
  );
  printRows(
    "Rows using tier_4_secondary or tier_5_user_reported",
    summary.issues.tier4Or5Rows,
    (row) => `${row.id} (${row.row}) ${row.source_tier}`
  );
  printRows("Rows that look structurally eligible for review", summary.issues.structurallyEligibleRows);
  printRows(
    "Rows blocked from approval",
    summary.issues.blockedFromApproval,
    (row) => `${row.id} (${row.row}): ${row.blockers.join("; ")}`
  );
}

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");
const intakeArg = args.find((arg) => arg !== "--json");

if (!intakeArg) {
  console.error("Usage: node scripts/summarize-research-intake.mjs ops/research/intake/[folder-name] [--json]");
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

let summary;

try {
  summary = buildSummary(intakeDir);
} catch (error) {
  console.error(`Research intake summary failed: ${error.message}`);
  process.exit(1);
}

if (jsonOutput) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  printTextSummary(summary);
}
