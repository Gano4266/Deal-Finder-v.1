import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  repoRoot,
  validateIntakeContract
} from "./research-intake-contract.mjs";
import { destinationFiles } from "./promotion-blockers.mjs";
import { buildReadinessReport } from "./readiness-report.mjs";

const args = process.argv.slice(2);
const forbiddenWriteFlags = new Set(["--write", "--write-reviewed-fixtures", "--write-fixtures"]);
const canonicalIntakePathPattern = /^ops\/research\/intake\/[a-z0-9][a-z0-9-]*-\d{4}-\d{2}-\d{2}$/;

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log("Usage: npm run research:flow -- ops/research/intake/<area>-YYYY-MM-DD [--smoke]");
  console.log("");
  console.log("Runs the read-only research-to-publish gate. It generates an intake checklist but never edits public fixtures.");
  process.exit(args.length === 0 ? 1 : 0);
}

const forbiddenFlag = args.find((arg) => forbiddenWriteFlags.has(arg));
if (forbiddenFlag) {
  console.error(`${forbiddenFlag} is intentionally not implemented for research:flow.`);
  console.error("Use the generated checklist and promotion packet, then make reviewed fixture edits manually.");
  process.exit(1);
}

const smokeRequested = args.includes("--smoke") || process.env.FORKCAST_RESEARCH_FLOW_SMOKE === "1";
const intakeArg = args.find((arg) => !arg.startsWith("--"));

if (!intakeArg) {
  console.error("Missing intake folder.");
  console.error("Usage: npm run research:flow -- ops/research/intake/<area>-YYYY-MM-DD [--smoke]");
  process.exit(1);
}

const intakeDir = path.resolve(process.cwd(), intakeArg);
const appDir = path.join(repoRoot, "app");
const checklistPath = path.join(intakeDir, "promotion-checklist.md");

function relativePath(absolutePath) {
  return path.relative(repoRoot, absolutePath).replaceAll(path.sep, "/");
}

function runStep({ name, command, args: commandArgs, cwd = repoRoot, optional = false }) {
  console.log(`\n== ${name} ==`);
  console.log(`$ ${command} ${commandArgs.join(" ")}`);

  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: "utf8",
    shell: false
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  const passed = result.status === 0;
  if (!passed && optional) {
    console.log(`Optional step skipped/failed without blocking the core flow: ${name}`);
  }

  return {
    name,
    command: `${command} ${commandArgs.join(" ")}`,
    cwd: relativePath(cwd),
    passed,
    optional,
    status: result.status,
    error: result.error?.message
  };
}

function gitStatusFor(paths) {
  const result = spawnSync("git", ["status", "--short", "--", ...paths], {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false
  });

  if (result.status !== 0) {
    return {
      available: false,
      changed: undefined,
      output: result.stderr.trim() || result.stdout.trim()
    };
  }

  return {
    available: true,
    changed: result.stdout.trim().length > 0,
    output: result.stdout.trim()
  };
}

function analyzeDealRows() {
  let report;
  try {
    report = buildReadinessReport(intakeDir);
  } catch (error) {
    return {
      totalRows: 0,
      alreadyPublicRows: [],
      promotableRows: [],
      blockedRows: [],
      blockerCategories: [],
      fieldsNeeded: [],
      statuses: {},
      error: error.message
    };
  }

  if (!report.ok) {
    return {
      totalRows: report.summary.totalRows,
      alreadyPublicRows: [],
      promotableRows: [],
      blockedRows: [],
      blockerCategories: [],
      fieldsNeeded: [],
      statuses: report.summary.statuses,
      error: report.contract.failures.join("; ")
    };
  }

  const alreadyPublicRows = report.rows.filter((row) => row.status === "already_public_clean");
  const promotableRows = report.rows.filter((row) => row.status === "ready_to_promote");
  const blockedRows = report.rows.filter((row) =>
    row.status !== "already_public_clean" && row.status !== "ready_to_promote"
  );

  return {
    totalRows: report.summary.totalRows,
    alreadyPublicRows,
    promotableRows,
    blockedRows,
    blockerCategories: report.summary.blockerCategories,
    fieldsNeeded: report.summary.fieldsNeeded,
    statuses: report.summary.statuses,
    error: undefined
  };
}

function nextAction({ analysis, steps, contract, smokeRequested }) {
  const firstFailed = steps.find((step) => !step.passed && !step.optional);

  if (firstFailed) {
    return `Fix the first failing gate, then rerun: ${firstFailed.command}`;
  }

  if (contract.failures.length > 0) {
    return "Fix intake contract failures, then rerun npm run research:flow for this folder.";
  }

  if (analysis.blockedRows.length > 0) {
    return `Resolve the blocker groups in ${relativePath(checklistPath)}, then rerun npm run research:flow -- ${relativePath(intakeDir)}.`;
  }

  if (analysis.promotableRows.length > 0) {
    return "Run ops promote:apply with exact deal IDs in dry-run mode, inspect the plan, then use write mode only for reviewed rows.";
  }

  if (analysis.alreadyPublicRows.length > 0) {
    return "No fixture promotion needed for already-public clean rows. Continue source freshness checks or add new reviewed candidates.";
  }

  if (!smokeRequested) {
    return "No promotable rows found. Add reviewed intake rows or rerun with --smoke if you only need a deploy smoke check.";
  }

  return "No promotable rows found. Current app gates passed; continue intake review before publication.";
}

function writeChecklist({ analysis, contract, steps, publicFixtureStatus, exactNextAction, intakePathIsCanonical }) {
  if (!fs.existsSync(intakeDir) || !fs.statSync(intakeDir).isDirectory()) {
    return undefined;
  }

  if (!intakePathIsCanonical) {
    return undefined;
  }

  const lines = [
    "# Promotion Checklist",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Intake folder: \`${relativePath(intakeDir)}\``,
    "",
    "This checklist is read-only guidance. It does not approve rows, edit fixtures, scrape websites, or hydrate public routes.",
    "",
    "## Gate Results",
    "",
    ...steps.map((step) => `- ${step.passed ? "PASS" : "FAIL"} ${step.name}${step.optional ? " (optional)" : ""}`),
    "",
    "## Intake Contract",
    "",
    `- Failures: ${contract.failures.length}`,
    `- Warnings: ${contract.warnings.length}`,
    ...contract.failures.map((failure) => `- Failure: ${failure}`),
    ...contract.warnings.map((warning) => `- Warning: ${warning}`),
    "",
    "## Promotion Readiness",
    "",
    `- Deal rows scanned: ${analysis.totalRows}`,
    `- Already public / fixture-clean: ${analysis.alreadyPublicRows.length}`,
    `- Promotable rows: ${analysis.promotableRows.length}`,
    `- Blocked rows: ${analysis.blockedRows.length}`,
    `- Public fixtures changed by this flow: ${publicFixtureStatus.changed ? "yes or already dirty" : "no"}`,
    "",
    "## Statuses",
    "",
    ...(Object.keys(analysis.statuses).length > 0
      ? Object.entries(analysis.statuses)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([status, count]) => `- ${status}: ${count}`)
      : ["- None"]),
    "",
    "## Blocker Categories",
    "",
    ...(analysis.blockerCategories.length > 0
      ? analysis.blockerCategories.flatMap((category) => [
          `- ${category.category}: ${category.count}`,
          ...category.blockers.map((blocker) => `  - ${blocker.count}x ${blocker.blocker}`)
        ])
      : ["- None"]),
    "",
    "## Fields Still Needed",
    "",
    ...(analysis.fieldsNeeded.length > 0 ? analysis.fieldsNeeded.map((field) => `- ${field}`) : ["- None"]),
    "",
    "## Rows",
    "",
    ...(analysis.promotableRows.length > 0
      ? [
          "### Promotable",
          "",
          ...analysis.promotableRows.map((row) => `- ${row.id} (row ${row.row}): ${row.deal_title}`)
        ]
      : ["### Promotable", "", "- None"]),
    "",
    ...(analysis.alreadyPublicRows.length > 0
      ? [
          "### Already Public / Fixture-Clean",
          "",
          ...analysis.alreadyPublicRows.map((row) => `- ${row.id} (row ${row.row}): ${row.deal_title}`)
        ]
      : ["### Already Public / Fixture-Clean", "", "- None"]),
    "",
    ...(analysis.blockedRows.length > 0
      ? [
          "### Blocked",
          "",
          ...analysis.blockedRows.flatMap((row) => [
            `- ${row.id} (row ${row.row}): ${row.deal_title}`,
            `  - Fields: ${row.fieldsNeeded.length > 0 ? row.fieldsNeeded.join(", ") : "manual review"}`,
            `  - Blockers: ${row.blockers.join("; ")}`
          ])
        ]
      : ["### Blocked", "", "- None"]),
    "",
    "## Destination Files For Manual Reviewed Promotion",
    "",
    ...destinationFiles.map((file) => `- \`${file}\``),
    "",
    "## Exact Next Action",
    "",
    exactNextAction,
    ""
  ];

  fs.writeFileSync(checklistPath, `${lines.join("\n")}\n`, "utf8");
  return checklistPath;
}

if (!fs.existsSync(intakeDir) || !fs.statSync(intakeDir).isDirectory()) {
  console.error(`Research intake folder not found: ${intakeArg}`);
  process.exit(1);
}

const publicFixtureStatusBefore = gitStatusFor(["fixtures/prototype"]);
const contract = validateIntakeContract(intakeDir);
const intakePathIsCanonical = canonicalIntakePathPattern.test(relativePath(intakeDir));
const steps = [];

steps.push(runStep({
  name: "Research intake validation",
  command: "node",
  args: ["scripts/validate-research-intake.mjs", relativePath(intakeDir)]
}));

steps.push(runStep({
  name: "Promotion dry-run",
  command: "node",
  args: ["scripts/dry-run-promote-research-intake.mjs", relativePath(intakeDir)]
}));

steps.push(runStep({
  name: "Promotion packet",
  command: "node",
  args: ["scripts/prepare-fixture-promotion-packet.mjs", relativePath(intakeDir)]
}));

steps.push(runStep({
  name: "App data validation",
  command: "npm",
  args: ["run", "validate:data"],
  cwd: appDir
}));

steps.push(runStep({
  name: "App typecheck",
  command: "npm",
  args: ["run", "typecheck"],
  cwd: appDir
}));

steps.push(runStep({
  name: "App lint",
  command: "npm",
  args: ["run", "lint"],
  cwd: appDir
}));

steps.push(runStep({
  name: "App build",
  command: "npm",
  args: ["run", "build"],
  cwd: appDir
}));

if (smokeRequested) {
  steps.push(runStep({
    name: "App smoke",
    command: "npm",
    args: ["run", "smoke"],
    cwd: appDir,
    optional: true
  }));
}

const analysis = analyzeDealRows();
const publicFixtureStatusAfter = gitStatusFor(["fixtures/prototype"]);
const publicFixtureChanged = publicFixtureStatusAfter.available
  ? publicFixtureStatusAfter.changed
  : publicFixtureStatusBefore.changed;
const appSafeToDeploy = steps
  .filter((step) => ["App data validation", "App typecheck", "App lint", "App build"].includes(step.name))
  .every((step) => step.passed);
const exactNextAction = nextAction({ analysis, steps, contract, smokeRequested });
const writtenChecklist = writeChecklist({
  analysis,
  contract,
  steps,
  publicFixtureStatus: { ...publicFixtureStatusAfter, changed: publicFixtureChanged },
  exactNextAction,
  intakePathIsCanonical
});

console.log("\n== Research Flow Summary ==");
console.log(`Intake folder: ${relativePath(intakeDir)}`);
console.log(`Validation: ${contract.failures.length === 0 ? "pass" : "fail"} (${contract.failures.length} failures, ${contract.warnings.length} warnings)`);
console.log(`Already public / fixture-clean: ${analysis.alreadyPublicRows.length}`);
console.log(`Promotable rows: ${analysis.promotableRows.length}`);
console.log(`Blocked rows: ${analysis.blockedRows.length}`);

console.log("\nBlocker categories");
if (analysis.blockerCategories.length === 0) {
  console.log("- none");
} else {
  analysis.blockerCategories.forEach((category) => {
    console.log(`- ${category.category}: ${category.count}`);
  });
}

console.log("\nFields still needed");
if (analysis.fieldsNeeded.length === 0) {
  console.log("- none");
} else {
  analysis.fieldsNeeded.forEach((field) => console.log(`- ${field}`));
}

console.log("\nDestination files affected by any future manual reviewed promotion");
destinationFiles.forEach((file) => console.log(`- ${file}`));
console.log(`\nPublic fixtures changed by this flow: ${publicFixtureChanged ? "yes or already dirty" : "no"}`);
if (publicFixtureStatusAfter.output) {
  console.log(publicFixtureStatusAfter.output);
}
console.log(`App safe to deploy from current fixtures: ${appSafeToDeploy ? "yes" : "no"}`);
console.log(`Write mode: deferred; no public fixtures were edited.`);
if (writtenChecklist) {
  console.log(`Checklist: ${relativePath(writtenChecklist)}`);
} else if (!intakePathIsCanonical) {
  console.log("Checklist: skipped because intake path is not canonical.");
}
if (analysis.error) {
  console.log(`Deal row analysis warning: ${analysis.error}`);
}
console.log(`Next action: ${exactNextAction}`);

const blockingFailure = steps.some((step) => !step.passed && !step.optional);
process.exit(blockingFailure || contract.failures.length > 0 ? 1 : 0);
