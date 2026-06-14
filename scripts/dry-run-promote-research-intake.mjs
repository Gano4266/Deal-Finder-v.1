import fs from "node:fs";
import path from "node:path";
import { readCsv, repoRoot, validateIntakeContract, value } from "./research-intake-contract.mjs";
import {
  categorizeBlockedRows,
  destinationFiles,
  promotionBlockers,
  publicFixtureMetadataBlockers,
  publicPromotionRowLabel,
  todayInWilmington
} from "./promotion-blockers.mjs";

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
      id: publicPromotionRowLabel(row, index),
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
const forbiddenWriteFlags = new Set(["--write", "--write-reviewed-fixtures", "--write-fixtures"]);

if (!intakeArg) {
  console.error("Usage: node scripts/dry-run-promote-research-intake.mjs ops/research/intake/[folder-name]");
  process.exit(1);
}

const forbiddenWriteFlag = process.argv.find((arg) => forbiddenWriteFlags.has(arg));
if (forbiddenWriteFlag) {
  console.error(`${forbiddenWriteFlag} is not implemented. This promotion guard is dry-run-only.`);
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
