import { spawnSync } from "node:child_process";
import path from "node:path";
import { repoRoot } from "./research-intake-contract.mjs";

const appDir = path.join(repoRoot, "app");
const args = process.argv.slice(2);
const allowedArgs = new Set(["--help", "-h", "--smoke"]);

if (args.includes("--help") || args.includes("-h")) {
  console.log("Usage: npm run verify [-- --smoke]");
  console.log("");
  console.log("Runs promotion/admin/readiness regression tests, app typecheck, lint, public data validation, and production build.");
  console.log("Smoke is optional because it requires a configured running server or base URL.");
  process.exit(0);
}

const unknownArg = args.find((arg) => !allowedArgs.has(arg));
if (unknownArg) {
  console.error(`Unknown verify argument: ${unknownArg}`);
  console.error("Usage: npm run verify [-- --smoke]");
  process.exit(1);
}

const smokeRequested = args.includes("--smoke") || process.env.FORKCAST_VERIFY_SMOKE === "1";

const steps = [
  {
    name: "Promotion blocker regression tests",
    command: "npm",
    args: ["run", "test:promotion"],
    cwd: repoRoot
  },
  {
    name: "Admin guard regression tests",
    command: "npm",
    args: ["run", "test:admin-guard"],
    cwd: repoRoot
  },
  {
    name: "Ops readiness regression tests",
    command: "npm",
    args: ["run", "test:readiness"],
    cwd: repoRoot
  },
  {
    name: "App typecheck",
    command: "npm",
    args: ["run", "typecheck"],
    cwd: appDir
  },
  {
    name: "App lint",
    command: "npm",
    args: ["run", "lint"],
    cwd: appDir
  },
  {
    name: "App data validation",
    command: "npm",
    args: ["run", "validate:data"],
    cwd: appDir
  },
  {
    name: "App build",
    command: "npm",
    args: ["run", "build"],
    cwd: appDir
  }
];

if (smokeRequested) {
  steps.push({
    name: "App smoke",
    command: "npm",
    args: ["run", "smoke"],
    cwd: appDir,
    optional: true
  });
}

function runStep(step) {
  console.log(`\n== ${step.name} ==`);
  console.log(`$ ${step.command} ${step.args.join(" ")}`);

  const result = spawnSync(step.command, step.args, {
    cwd: step.cwd,
    encoding: "utf8",
    shell: false
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  return {
    ...step,
    passed: result.status === 0,
    status: result.status,
    error: result.error?.message
  };
}

const results = steps.map(runStep);
const failed = results.filter((result) => !result.passed && !result.optional);

console.log("\n== Verify Summary ==");
results.forEach((result) => {
  console.log(`- ${result.passed ? "PASS" : "FAIL"} ${result.name}${result.optional ? " (optional)" : ""}`);
});

if (!smokeRequested) {
  console.log("- SKIP App smoke (set FORKCAST_VERIFY_SMOKE=1 or pass --smoke when a server/base URL is configured)");
}

if (failed.length > 0) {
  process.exit(1);
}
