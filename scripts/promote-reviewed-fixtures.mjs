import { spawnSync } from "node:child_process";
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
  promotionBlockers,
  todayInWilmington
} from "./promotion-blockers.mjs";

const prototypeMetadata = {
  fixture_data_class: "verified_static",
  is_live_data: "false",
  prototype_notice: "Static prototype data. Deal availability is not live and must be confirmed against the listed evidence date."
};

const fixtureFiles = {
  restaurants: "fixtures/prototype/restaurants.csv",
  sources: "fixtures/prototype/sources.csv",
  sourceCaptures: "fixtures/prototype/source-captures.csv",
  sourceChecks: "fixtures/prototype/source-checks.csv",
  deals: "fixtures/prototype/deals.csv",
  reviewTasks: "fixtures/prototype/review-tasks.csv",
  auditEvents: "fixtures/prototype/audit-events.csv"
};

const intakeFiles = {
  restaurants: "restaurant-source-list.csv",
  sources: "source-inventory.csv",
  sourceCaptures: "source-captures.csv",
  sourceChecks: "source-checks.csv",
  deals: "deal-intake.csv",
  reviewTasks: "review-tasks.csv",
  auditEvents: "audit-events.csv"
};

const idFields = {
  restaurants: "restaurant_id",
  sources: "source_id",
  sourceCaptures: "source_capture_id",
  sourceChecks: "source_check_id",
  deals: "deal_id",
  reviewTasks: "review_task_id",
  auditEvents: "audit_event_id"
};

const manifestFile = "fixtures/prototype/fixture-manifest.json";
const seedCandidatesFile = "ops/seeds/wilmington-deal-candidates.csv";
const canonicalIntakePathPattern = /^ops\/research\/intake\/[a-z0-9][a-z0-9-]*-\d{4}-\d{2}-\d{2}$/;

function relativePath(absolutePath) {
  return path.relative(repoRoot, absolutePath).replaceAll(path.sep, "/");
}

function csvEscape(input) {
  const text = String(input ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }

  return text;
}

function writeCsv(absolutePath, headers, rows) {
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header] ?? "")).join(","))
  ];
  fs.writeFileSync(absolutePath, `${lines.join("\n")}\n`, "utf8");
}

function byId(rows, field) {
  return new Map(rows.filter((row) => value(row, field)).map((row) => [value(row, field), row]));
}

function readFixtureCsv(key) {
  const absolutePath = path.join(repoRoot, fixtureFiles[key]);
  return { absolutePath, ...readCsv(absolutePath, fixtureFiles[key]) };
}

function readIntakeCsv(intakeDir, key) {
  const absolutePath = path.join(intakeDir, intakeFiles[key]);
  if (!fs.existsSync(absolutePath)) {
    return { absolutePath, headers: [], rows: [], missing: true };
  }

  return { absolutePath, ...readCsv(absolutePath, intakeFiles[key]), missing: false };
}

function pickForHeaders(row, headers, overrides = {}) {
  return Object.fromEntries(headers.map((header) => [header, overrides[header] ?? row[header] ?? ""]));
}

function withPrototypeMetadata(row) {
  return { ...row, ...prototypeMetadata };
}

function idList(text) {
  return text
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function sourceCheckSupportsDeal(sourceCheck, dealId) {
  return value(sourceCheck, "deal_id") === dealId || idList(value(sourceCheck, "affected_deal_ids")).includes(dealId);
}

function auditEventSupportsDeal(auditEvent, dealId, reviewTaskId) {
  return value(auditEvent, "related_deal_id") === dealId ||
    value(auditEvent, "entity_id") === dealId ||
    value(auditEvent, "related_review_task_id") === reviewTaskId;
}

function evidencePathExists(row, field) {
  const pathValue = value(row, field);
  if (!pathValue || /^https?:\/\//.test(pathValue)) {
    return true;
  }

  return fs.existsSync(path.join(repoRoot, pathValue));
}

function parseArgs(rawArgs) {
  const options = {
    dryRun: false,
    writeReviewedFixtures: false,
    dealIds: []
  };
  const positional = [];

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--write-reviewed-fixtures") {
      options.writeReviewedFixtures = true;
      continue;
    }

    if (arg === "--deal" || arg === "--deal-id") {
      const dealId = rawArgs[index + 1];
      if (!dealId) {
        throw new Error("--deal requires a deal_id");
      }
      options.dealIds.push(dealId);
      index += 1;
      continue;
    }

    if (arg === "--all" || arg === "--all-promotable") {
      throw new Error("Phase 3 requires exact --deal IDs; broad all-row promotion is not implemented");
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown promotion option: ${arg}`);
    }

    positional.push(arg);
  }

  if (options.writeReviewedFixtures && options.dryRun) {
    throw new Error("Use either --dry-run or --write-reviewed-fixtures, not both");
  }

  return {
    intakeArg: positional[0],
    options
  };
}

function loadState(intakeDir) {
  const fixtures = Object.fromEntries(Object.keys(fixtureFiles).map((key) => [key, readFixtureCsv(key)]));
  const intake = Object.fromEntries(Object.keys(intakeFiles).map((key) => [key, readIntakeCsv(intakeDir, key)]));
  const seedCandidates = readCsv(path.join(repoRoot, seedCandidatesFile), seedCandidatesFile);
  const candidateIds = new Set(seedCandidates.rows.map((row) => value(row, "candidate_id")).filter(Boolean));
  const researchIntakeRoot = path.join(repoRoot, "ops/research/intake");

  if (fs.existsSync(researchIntakeRoot)) {
    fs.readdirSync(researchIntakeRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name !== "example-area")
      .forEach((entry) => {
        const dealIntakePath = path.join(researchIntakeRoot, entry.name, "deal-intake.csv");
        if (!fs.existsSync(dealIntakePath)) {
          return;
        }

        readCsv(dealIntakePath, path.relative(repoRoot, dealIntakePath)).rows
          .map((row) => value(row, "candidate_id"))
          .filter(Boolean)
          .forEach((id) => candidateIds.add(id));
      });
  }

  return {
    fixtures,
    intake,
    candidateIds
  };
}

function requireIntakeRow({ intake, key, id, errors }) {
  const file = intake[key];
  if (file.missing) {
    errors.push(`${intakeFiles[key]} is missing`);
    return undefined;
  }

  const row = byId(file.rows, idFields[key]).get(id);
  if (!row) {
    errors.push(`${intakeFiles[key]} is missing ${idFields[key]}=${id}`);
  }

  return row;
}

function buildRowsForDeal({ state, dealRow }) {
  const errors = [];
  const dealId = value(dealRow, "deal_id");
  const reviewTaskId = value(dealRow, "review_task_id");
  const auditEventId = value(requireIntakeRow({
    intake: state.intake,
    key: "reviewTasks",
    id: reviewTaskId,
    errors
  }) ?? {}, "audit_event_id");
  const restaurantRow = requireIntakeRow({ intake: state.intake, key: "restaurants", id: value(dealRow, "restaurant_id"), errors });
  const sourceRow = requireIntakeRow({ intake: state.intake, key: "sources", id: value(dealRow, "source_id"), errors });
  const captureRow = requireIntakeRow({ intake: state.intake, key: "sourceCaptures", id: value(dealRow, "source_capture_id"), errors });
  const checkRow = requireIntakeRow({ intake: state.intake, key: "sourceChecks", id: value(dealRow, "source_check_id"), errors });
  const reviewTaskRow = requireIntakeRow({ intake: state.intake, key: "reviewTasks", id: reviewTaskId, errors });
  const auditEventRow = auditEventId
    ? requireIntakeRow({ intake: state.intake, key: "auditEvents", id: auditEventId, errors })
    : undefined;

  if (!auditEventId) {
    errors.push(`${dealId}: review task ${reviewTaskId || "[blank]"} is missing audit_event_id`);
  }

  if (checkRow && !sourceCheckSupportsDeal(checkRow, dealId)) {
    errors.push(`${dealId}: source check ${value(dealRow, "source_check_id")} does not reference deal_id or affected_deal_ids`);
  }

  if (auditEventRow && !auditEventSupportsDeal(auditEventRow, dealId, reviewTaskId)) {
    errors.push(`${dealId}: audit event ${auditEventId} does not reference deal_id or review_task_id`);
  }

  if (captureRow) {
    ["archive_url_or_path", "screenshot_path"].forEach((field) => {
      if (!evidencePathExists(captureRow, field)) {
        errors.push(`${dealId}: source capture ${field} points to missing local evidence ${value(captureRow, field)}`);
      }
    });
  }

  ["archive_url_or_path", "evidence_url_or_path", "screenshot_path"].forEach((field) => {
    if (!evidencePathExists(dealRow, field)) {
      errors.push(`${dealId}: deal ${field} points to missing local evidence ${value(dealRow, field)}`);
    }
  });

  if (!state.candidateIds.has(value(dealRow, "candidate_id"))) {
    errors.push(`${dealId}: candidate_id ${value(dealRow, "candidate_id") || "[blank]"} is not present in seed or research intake candidates`);
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors,
    rows: {
      restaurants: withPrototypeMetadata(pickForHeaders(restaurantRow, state.fixtures.restaurants.headers)),
      sources: withPrototypeMetadata(pickForHeaders(sourceRow, state.fixtures.sources.headers)),
      sourceCaptures: withPrototypeMetadata(pickForHeaders(captureRow, state.fixtures.sourceCaptures.headers)),
      sourceChecks: withPrototypeMetadata(pickForHeaders(checkRow, state.fixtures.sourceChecks.headers)),
      deals: withPrototypeMetadata(pickForHeaders(dealRow, state.fixtures.deals.headers)),
      reviewTasks: withPrototypeMetadata(pickForHeaders(reviewTaskRow, state.fixtures.reviewTasks.headers, {
        related_type: "deal",
        related_id: dealId,
        deal_id: dealId,
        status: "closed",
        decision: "approved"
      })),
      auditEvents: withPrototypeMetadata(pickForHeaders(auditEventRow, state.fixtures.auditEvents.headers))
    }
  };
}

function manifestCounts(fixtures) {
  return {
    restaurants: fixtures.restaurants.rows.length,
    sources: fixtures.sources.rows.length,
    source_captures: fixtures.sourceCaptures.rows.length,
    source_checks: fixtures.sourceChecks.rows.length,
    public_deals: fixtures.deals.rows.length,
    review_tasks: fixtures.reviewTasks.rows.length,
    audit_events: fixtures.auditEvents.rows.length
  };
}

function applyManifestCounts(fixtures) {
  const absolutePath = path.join(repoRoot, manifestFile);
  const manifest = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  manifest.fixture_generated_at = new Date().toISOString();
  manifest.current_seed_counts = manifestCounts(fixtures);
  fs.writeFileSync(absolutePath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function addMaterializedRow(rowsByKey, key, row, errors, context) {
  const idField = idFields[key];
  const id = value(row, idField);
  const existing = rowsByKey[key].find((candidate) => value(candidate, idField) === id);

  if (!existing) {
    rowsByKey[key].push(row);
    return;
  }

  if (JSON.stringify(existing) !== JSON.stringify(row)) {
    errors.push(`${context}: selected deals materialize conflicting ${fixtureFiles[key]} rows for ${idField}=${id}`);
  }
}

export function buildPromotionPlan({ intakeDir, options }) {
  const intakeRelativePath = relativePath(intakeDir);
  const errors = [];
  const contract = validateIntakeContract(intakeDir);

  if (!canonicalIntakePathPattern.test(intakeRelativePath)) {
    errors.push("intake path must be canonical: ops/research/intake/<area>-YYYY-MM-DD");
  }

  if (contract.failures.length > 0) {
    errors.push(...contract.failures.map((failure) => `intake contract: ${failure}`));
  }

  if (options.dealIds.length === 0) {
    errors.push("Phase 3 requires at least one exact --deal <deal_id>");
  }

  const state = loadState(intakeDir);
  const dealRowsById = byId(state.intake.deals.rows, "deal_id");
  const fixtureDealsById = byId(state.fixtures.deals.rows, "deal_id");
  const rowsByKey = Object.fromEntries(Object.keys(fixtureFiles).map((key) => [key, []]));
  const dealPlans = [];
  const today = todayInWilmington();
  const uniqueDealIds = [...new Set(options.dealIds)];

  uniqueDealIds.forEach((dealId) => {
    const dealErrors = [];
    const dealRow = dealRowsById.get(dealId);

    if (!dealRow) {
      dealErrors.push(`deal-intake.csv is missing deal_id=${dealId}`);
    } else {
      const blockers = promotionBlockers(withPrototypeMetadata(dealRow), today).blockers;
      if (blockers.length > 0) {
        dealErrors.push(...blockers.map((blocker) => `${dealId}: ${blocker}`));
      }

      if (fixtureDealsById.has(dealId)) {
        dealErrors.push(`${dealId}: public fixture deal already exists; exact apply does not replace existing public deals`);
      }

      const built = buildRowsForDeal({ state, dealRow });
      dealErrors.push(...built.errors);
      if (built.rows && dealErrors.length === 0) {
        Object.entries(built.rows).forEach(([key, row]) => {
          addMaterializedRow(rowsByKey, key, row, dealErrors, dealId);
        });
      }
    }

    dealPlans.push({
      deal_id: dealId,
      status: dealErrors.length > 0 ? "blocked" : "ready",
      blockers: dealErrors
    });
  });

  errors.push(...dealPlans.flatMap((plan) => plan.blockers));

  const operations = [];
  Object.entries(rowsByKey).forEach(([key, rows]) => {
    const idField = idFields[key];
    const fixtureRowsById = byId(state.fixtures[key].rows, idField);
    rows.forEach((row) => {
      const id = value(row, idField);
      const existing = fixtureRowsById.get(id);
      if (existing && JSON.stringify(existing) !== JSON.stringify(row)) {
        errors.push(`${fixtureFiles[key]} already has ${idField}=${id} with different content; exact apply will not mutate existing public rows`);
      }

      operations.push({
        file: fixtureFiles[key],
        id,
        action: existing ? "already-present" : "insert",
        kind: key
      });
    });
  });

  return {
    intakeFolder: intakeRelativePath,
    writeRequested: options.writeReviewedFixtures,
    safeToWrite: errors.length === 0,
    contractWarnings: contract.warnings,
    requestedDealIds: uniqueDealIds,
    dealPlans,
    operations,
    errors,
    state,
    rowsByKey
  };
}

function applyPlan(plan) {
  const snapshots = new Map();
  const affectedFiles = [
    ...Object.values(fixtureFiles),
    manifestFile
  ];

  affectedFiles.forEach((relativeFile) => {
    const absolutePath = path.join(repoRoot, relativeFile);
    snapshots.set(relativeFile, fs.readFileSync(absolutePath, "utf8"));
  });

  try {
    Object.entries(plan.rowsByKey).forEach(([key, rows]) => {
      rows.forEach((row) => {
        const idField = idFields[key];
        const existing = plan.state.fixtures[key].rows.find((fixtureRow) => value(fixtureRow, idField) === value(row, idField));
        if (!existing) {
          plan.state.fixtures[key].rows.push(row);
        }
      });
    });

    Object.entries(plan.state.fixtures).forEach(([key, file]) => {
      writeCsv(file.absolutePath, file.headers, file.rows);
    });

    applyManifestCounts(plan.state.fixtures);

    const validation = spawnSync("npm", ["run", "validate:data"], {
      cwd: path.join(repoRoot, "app"),
      encoding: "utf8",
      shell: false
    });

    if (validation.status !== 0) {
      snapshots.forEach((content, relativeFile) => {
        fs.writeFileSync(path.join(repoRoot, relativeFile), content, "utf8");
      });
      throw new Error(`fixture validation failed after write; restored snapshots\n${validation.stdout}${validation.stderr}`);
    }

    return {
      validationOutput: `${validation.stdout}${validation.stderr}`,
      affectedFiles
    };
  } catch (error) {
    snapshots.forEach((content, relativeFile) => {
      fs.writeFileSync(path.join(repoRoot, relativeFile), content, "utf8");
    });
    throw error;
  }
}

function printPlan(plan) {
  console.log(`Reviewed fixture promotion apply: ${plan.intakeFolder}`);
  console.log(plan.writeRequested
    ? "Write requested with --write-reviewed-fixtures."
    : "Dry run only. Pass --write-reviewed-fixtures to apply exact reviewed fixture rows.");
  console.log(`Safe to write: ${plan.safeToWrite ? "yes" : "no"}`);

  if (plan.contractWarnings.length > 0) {
    console.log("\nContract warnings");
    plan.contractWarnings.forEach((warning) => console.log(`- ${warning}`));
  }

  console.log("\nRequested deals");
  plan.dealPlans.forEach((deal) => {
    console.log(`- ${deal.deal_id}: ${deal.status}`);
    deal.blockers.forEach((blocker) => console.log(`  - ${blocker}`));
  });

  console.log("\nPlanned fixture operations");
  if (plan.operations.length === 0) {
    console.log("- none");
  } else {
    plan.operations.forEach((operation) => {
      console.log(`- ${operation.action} ${operation.file} ${operation.id}`);
    });
  }

  if (plan.errors.length > 0) {
    console.log("\nBlocked");
    plan.errors.forEach((error) => console.log(`- ${error}`));
  }
}

function printGitDiff(files) {
  const args = ["diff", "--", ...files];
  const diff = spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false
  });
  if (diff.stdout) {
    process.stdout.write(diff.stdout);
  }
  if (diff.stderr) {
    process.stderr.write(diff.stderr);
  }
}

async function runCli() {
  const rawArgs = process.argv.slice(2);

  if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
    console.log("Usage: node scripts/promote-reviewed-fixtures.mjs ops/research/intake/<area>-YYYY-MM-DD --deal <deal_id> [--deal <deal_id>] [--dry-run|--write-reviewed-fixtures]");
    process.exit(0);
  }

  let parsed;
  try {
    parsed = parseArgs(rawArgs);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  if (!parsed.intakeArg) {
    console.error("Missing intake folder.");
    process.exit(1);
  }

  const intakeDir = path.resolve(process.cwd(), parsed.intakeArg);
  if (!fs.existsSync(intakeDir) || !fs.statSync(intakeDir).isDirectory()) {
    console.error(`Research intake folder not found: ${parsed.intakeArg}`);
    process.exit(1);
  }

  try {
    const plan = buildPromotionPlan({ intakeDir, options: parsed.options });
    printPlan(plan);

    if (!plan.safeToWrite) {
      process.exit(1);
    }

    if (!parsed.options.writeReviewedFixtures) {
      return;
    }

    const result = applyPlan(plan);
    console.log("\nFixture validation after write");
    process.stdout.write(result.validationOutput);
    console.log("\nGenerated git diff");
    printGitDiff(result.affectedFiles);
  } catch (error) {
    console.error(`Reviewed fixture promotion failed: ${error.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
