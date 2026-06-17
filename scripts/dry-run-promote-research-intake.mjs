import fs from "node:fs";
import path from "node:path";
import { buildReadinessReport } from "./readiness-report.mjs";
import { repoRoot } from "./research-intake-contract.mjs";

const args = process.argv.slice(2);
const forbiddenWriteFlags = new Set(["--write", "--write-reviewed-fixtures", "--write-fixtures"]);

function usage(exitCode = 0) {
  console.log("Usage: node scripts/dry-run-promote-research-intake.mjs ops/research/intake/[folder-name]");
  process.exit(exitCode);
}

function rowsWithStatus(report, status) {
  return report.rows.filter((row) => row.status === status);
}

function blockedRows(report) {
  return report.rows.filter((row) =>
    row.status !== "already_public_clean" && row.status !== "ready_to_promote"
  );
}

function printRows(title, rows, formatter) {
  console.log(`\n${title}: ${rows.length}`);
  rows.forEach((row) => console.log(`- ${formatter(row)}`));
}

function nextCommand(report) {
  const readyRows = rowsWithStatus(report, "ready_to_promote");
  if (readyRows.length === 0) {
    return report.nextAction;
  }

  const dealArgs = readyRows
    .map((row) => row.deal_id)
    .filter(Boolean)
    .map((dealId) => `--deal ${dealId}`)
    .join(" ");

  return `npm run ops -- promote:apply ${report.intakeFolder} ${dealArgs} --dry-run`;
}

function printPlan(report) {
  console.log(`Research intake promotion plan: ${report.intakeFolder}`);
  console.log("Dry run only. No fixture edits, approvals, promotions, scraping, or API calls.");

  if (!report.ok) {
    console.log("\nContract failures");
    report.contract.failures.forEach((failure) => console.log(`- ${failure}`));
    console.log(`\nNext action: ${report.nextAction}`);
    return;
  }

  if (report.contract.warnings.length > 0) {
    console.log("\nContract warnings");
    report.contract.warnings.forEach((warning) => console.log(`- ${warning}`));
  }

  console.log("\nPromotion readiness");
  console.log(`- Total rows scanned: ${report.summary.totalRows}`);
  console.log(`- Already public / fixture-clean: ${report.summary.alreadyPublicClean}`);
  console.log(`- Ready for exact-ID promotion: ${report.summary.readyToPromote}`);
  console.log(`- Blocked or needs review: ${blockedRows(report).length}`);

  console.log("\nStatuses");
  Object.entries(report.summary.statuses)
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([status, count]) => console.log(`- ${status}: ${count}`));

  console.log("\nBlocker categories");
  if (report.summary.blockerCategories.length === 0) {
    console.log("- none");
  } else {
    report.summary.blockerCategories.forEach((category) => {
      console.log(`- ${category.category}: ${category.count}`);
    });
  }

  printRows(
    "Already public / fixture-clean",
    rowsWithStatus(report, "already_public_clean"),
    (row) => `${row.id} (${row.row}) ${row.deal_title}`
  );

  printRows(
    "Ready for exact-ID promotion",
    rowsWithStatus(report, "ready_to_promote"),
    (row) => `${row.id} (${row.row}) ${row.deal_title}`
  );

  printRows(
    "Blocked or needs review",
    blockedRows(report),
    (row) => `${row.id} (${row.row}): ${row.blockers.length > 0 ? row.blockers.join("; ") : row.label}`
  );

  if (blockedRows(report).length > 0) {
    console.log("\nFields still needed before promotion");
    blockedRows(report).forEach((row) => {
      const needed = row.fieldsNeeded.length > 0 ? row.fieldsNeeded.join(", ") : "manual review";
      console.log(`- ${row.id} (${row.row}): ${needed}`);
    });
  }

  console.log("\nDestination files for future reviewed promotion");
  report.destinationFilesForFuturePromotion.forEach((file) => console.log(`- ${file}`));

  console.log("\nManual decisions still required before any write");
  [
    "Confirm each exact deal ID selected for apply.",
    "Review generated fixture operations before --write-reviewed-fixtures.",
    "Do not use AI output, third-party chatter, or user notes as source evidence.",
    "Run npm run verify after any successful fixture write."
  ].forEach((decision) => console.log(`- ${decision}`));

  console.log(`\nSuggested next command: ${nextCommand(report)}`);
}

const forbiddenWriteFlag = args.find((arg) => forbiddenWriteFlags.has(arg));
if (forbiddenWriteFlag) {
  console.error(`${forbiddenWriteFlag} is not implemented. This promotion plan is dry-run-only.`);
  process.exit(1);
}

const intakeArg = args.find((arg) => !arg.startsWith("--"));
if (args.includes("--help") || args.includes("-h")) {
  usage(0);
}

if (!intakeArg) {
  usage(1);
}

const intakeDir = path.resolve(process.cwd(), intakeArg);
if (!fs.existsSync(intakeDir) || !fs.statSync(intakeDir).isDirectory()) {
  console.error(`Research intake folder not found: ${intakeArg}`);
  process.exit(1);
}

let report;
try {
  report = buildReadinessReport(intakeDir);
} catch (error) {
  console.error(`Research intake promotion plan failed: ${error.message}`);
  process.exit(1);
}

printPlan(report);

if (!report.ok) {
  process.exit(1);
}
