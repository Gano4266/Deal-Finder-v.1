import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  readCsv,
  repoRoot,
  validateIntakeContract,
  value
} from "./research-intake-contract.mjs";
import {
  categorizeBlocker,
  destinationFiles,
  promotionBlockers,
  publicPromotionRowLabel,
  summarizeBlockerCategories,
  todayInWilmington
} from "./promotion-blockers.mjs";

const currentFilePath = fileURLToPath(import.meta.url);

function relativePath(absolutePath) {
  return path.relative(repoRoot, absolutePath).replaceAll(path.sep, "/");
}

function readOptionalCsv(relativePathToFile) {
  const absolutePath = path.join(repoRoot, relativePathToFile);
  if (!fs.existsSync(absolutePath)) {
    return { headers: [], rows: [] };
  }

  return readCsv(absolutePath, relativePathToFile);
}

function rowKey(row) {
  return value(row, "deal_id") || value(row, "candidate_id");
}

function byDealOrCandidate(rows) {
  const byDealId = new Map();
  const byCandidateId = new Map();

  rows.forEach((row) => {
    const dealId = value(row, "deal_id");
    const candidateId = value(row, "candidate_id");

    if (dealId) {
      byDealId.set(dealId, row);
    }

    if (candidateId) {
      byCandidateId.set(candidateId, row);
    }
  });

  return { byDealId, byCandidateId };
}

function findPublicRow(row, publicIndexes) {
  const dealId = value(row, "deal_id");
  const candidateId = value(row, "candidate_id");

  if (dealId && publicIndexes.byDealId.has(dealId)) {
    return publicIndexes.byDealId.get(dealId);
  }

  if (candidateId && publicIndexes.byCandidateId.has(candidateId)) {
    return publicIndexes.byCandidateId.get(candidateId);
  }

  return undefined;
}

function primaryBlockerCategory(blockers) {
  if (blockers.length === 0) {
    return undefined;
  }

  const counts = new Map();
  blockers.forEach((blocker) => {
    const category = categorizeBlocker(blocker);
    counts.set(category, (counts.get(category) ?? 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0][0];
}

function statusForRow({ intakeGate, publicGate, publicRow }) {
  if (publicRow && publicGate.blockers.length === 0) {
    return {
      status: "already_public_clean",
      label: "already public / fixture-clean",
      nextAction: "No fixture promotion needed. Keep on normal freshness checks."
    };
  }

  if (publicRow) {
    return {
      status: "public_fixture_needs_review",
      label: "public fixture needs review",
      nextAction: "Review the existing public fixture row before using intake as a replacement."
    };
  }

  if (intakeGate.blockers.length === 0) {
    return {
      status: "ready_to_promote",
      label: "ready for exact-ID fixture promotion",
      nextAction: "Run a no-write promotion plan, then promote by exact ID after confirming the diff."
    };
  }

  const category = primaryBlockerCategory(intakeGate.blockers) ?? "manual review";
  return {
    status: `blocked_${category.replaceAll(" ", "_").replaceAll("/", "_")}`,
    label: `blocked: ${category}`,
    nextAction: "Resolve blockers before fixture promotion."
  };
}

export function buildReadinessReport(intakeDir) {
  const contract = validateIntakeContract(intakeDir);
  const intakeRelativePath = relativePath(intakeDir);
  const dealPath = path.join(intakeDir, "deal-intake.csv");

  if (contract.failures.length > 0) {
    return {
      intakeFolder: intakeRelativePath,
      ok: false,
      contract: {
        failures: contract.failures,
        warnings: contract.warnings
      },
      rows: [],
      summary: {
        totalRows: 0,
        statuses: {},
        blockerCategories: [],
        fieldsNeeded: []
      },
      nextAction: "Fix intake contract failures, then rerun readiness."
    };
  }

  if (!fs.existsSync(dealPath)) {
    return {
      intakeFolder: intakeRelativePath,
      ok: false,
      contract: {
        failures: ["deal-intake.csv is missing"],
        warnings: contract.warnings
      },
      rows: [],
      summary: {
        totalRows: 0,
        statuses: {},
        blockerCategories: [],
        fieldsNeeded: []
      },
      nextAction: "Add deal-intake.csv, then rerun readiness."
    };
  }

  const today = todayInWilmington();
  const intakeRows = readCsv(dealPath, "deal-intake.csv").rows;
  const publicDeals = readOptionalCsv("fixtures/prototype/deals.csv").rows;
  const publicIndexes = byDealOrCandidate(publicDeals);
  const blockedForCategorySummary = [];

  const rows = intakeRows.map((row, index) => {
    const publicRow = findPublicRow(row, publicIndexes);
    const intakeGate = promotionBlockers(row, today);
    const publicGate = publicRow
      ? promotionBlockers(publicRow, today)
      : { blockers: [], fieldsNeeded: [] };
    const readiness = statusForRow({ intakeGate, publicGate, publicRow });
    const activeGate = publicRow ? publicGate : intakeGate;

    if (activeGate.blockers.length > 0) {
      blockedForCategorySummary.push({
        id: rowKey(row) || publicPromotionRowLabel(row, index),
        blockers: activeGate.blockers
      });
    }

    return {
      row: index + 2,
      id: publicPromotionRowLabel(row, index),
      deal_id: value(row, "deal_id"),
      candidate_id: value(row, "candidate_id"),
      restaurant_id: value(row, "restaurant_id"),
      deal_title: value(row, "deal_title") || value(row, "public_title") || "(untitled)",
      status: readiness.status,
      label: readiness.label,
      nextAction: readiness.nextAction,
      public_fixture_exists: Boolean(publicRow),
      public_fixture_deal_id: publicRow ? value(publicRow, "deal_id") : "",
      blockers: activeGate.blockers,
      fieldsNeeded: activeGate.fieldsNeeded
    };
  });

  const statuses = rows.reduce((counts, row) => {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
    return counts;
  }, {});
  const fieldsNeeded = [...new Set(rows.flatMap((row) => row.fieldsNeeded))].sort();
  const readyRows = rows.filter((row) => row.status === "ready_to_promote");
  const blockedRows = rows.filter((row) => row.blockers.length > 0);

  return {
    intakeFolder: intakeRelativePath,
    ok: true,
    dryRunOnly: true,
    contract: {
      failures: [],
      warnings: contract.warnings
    },
    summary: {
      totalRows: rows.length,
      statuses,
      readyToPromote: readyRows.length,
      alreadyPublicClean: statuses.already_public_clean ?? 0,
      blockedRows: blockedRows.length,
      blockerCategories: summarizeBlockerCategories(blockedForCategorySummary),
      fieldsNeeded
    },
    destinationFilesForFuturePromotion: destinationFiles,
    rows,
    nextAction: readyRows.length > 0
      ? "Run promote:plan for exact IDs before any fixture write."
      : "No rows are ready for fixture promotion. Use statuses and blockers to choose review work."
  };
}

function printRows(title, rows) {
  console.log(`\n${title}: ${rows.length}`);
  rows.forEach((row) => {
    console.log(`- ${row.id} (${row.row}): ${row.deal_title}`);
    console.log(`  status: ${row.label}`);
    if (row.public_fixture_exists) {
      console.log(`  public fixture: ${row.public_fixture_deal_id}`);
    }
    if (row.blockers.length > 0) {
      console.log(`  blockers: ${row.blockers.join("; ")}`);
    }
  });
}

export function printReadinessReport(report) {
  console.log(`Ops readiness: ${report.intakeFolder}`);
  console.log("Read-only. No scraping, fixture edits, approvals, promotions, or public route hydration.");

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

  console.log("\nSummary");
  console.log(`- Total rows: ${report.summary.totalRows}`);
  console.log(`- Already public / fixture-clean: ${report.summary.alreadyPublicClean}`);
  console.log(`- Ready for exact-ID promotion: ${report.summary.readyToPromote}`);
  console.log(`- Blocked rows: ${report.summary.blockedRows}`);

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

  console.log("\nFields still needed");
  if (report.summary.fieldsNeeded.length === 0) {
    console.log("- none");
  } else {
    report.summary.fieldsNeeded.forEach((field) => console.log(`- ${field}`));
  }

  printRows(
    "Already public / fixture-clean",
    report.rows.filter((row) => row.status === "already_public_clean")
  );
  printRows(
    "Ready for exact-ID promotion",
    report.rows.filter((row) => row.status === "ready_to_promote")
  );
  printRows(
    "Blocked or needs review",
    report.rows.filter((row) => row.status !== "already_public_clean" && row.status !== "ready_to_promote")
  );

  console.log("\nDestination files for future reviewed promotion");
  report.destinationFilesForFuturePromotion.forEach((file) => console.log(`- ${file}`));
  console.log(`\nNext action: ${report.nextAction}`);
}

function runCli() {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const intakeArg = args.find((arg) => !arg.startsWith("--"));

  if (!intakeArg || args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node scripts/readiness-report.mjs ops/research/intake/<area>-YYYY-MM-DD [--json]");
    process.exit(intakeArg ? 0 : 1);
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
    console.error(`Readiness failed: ${error.message}`);
    process.exit(1);
  }

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReadinessReport(report);
  }

  if (!report.ok) {
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  runCli();
}
