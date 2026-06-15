import { spawnSync } from "node:child_process";
import path from "node:path";
import { repoRoot } from "./research-intake-contract.mjs";

const args = process.argv.slice(2);
const phase = args[0];
const phaseArgs = args.slice(1).filter((arg) => arg !== "--");

const phases = new Map([
  ["readiness", runReadiness],
  ["intake", runIntake],
  ["review", runReview],
  ["promote:plan", runPromotePlan],
  ["deploy:check", runDeployCheck],
  ["deploy:smoke", runDeploySmoke],
  ["scrape", notImplemented("scrape", "Phase 2 will capture official sources into canonical intake folders.")],
  ["promote:apply", notImplemented("promote:apply", "Phase 3 will write fixtures by exact reviewed IDs only.")]
]);

function usage(exitCode = 0) {
  console.log("Usage: npm run ops -- <phase> [args]");
  console.log("");
  console.log("Phases:");
  console.log("- readiness <intake> [--json]");
  console.log("- intake <intake>");
  console.log("- review <intake>");
  console.log("- promote:plan <intake>");
  console.log("- deploy:check");
  console.log("- deploy:smoke -- --url <deployed-url>");
  console.log("- scrape (reserved for official-source capture automation)");
  console.log("- promote:apply (reserved for exact-ID reviewed fixture promotion)");
  process.exit(exitCode);
}

function runNode(script, scriptArgs, options = {}) {
  return runCommand("node", [script, ...scriptArgs], options);
}

function runNpm(script, scriptArgs = [], options = {}) {
  return runCommand("npm", ["run", script, ...scriptArgs], options);
}

function runCommand(command, commandArgs, { cwd = repoRoot, env = process.env } = {}) {
  console.log(`\n$ ${command} ${commandArgs.join(" ")}`);
  const result = spawnSync(command, commandArgs, {
    cwd,
    env,
    encoding: "utf8",
    shell: false
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function requireIntake(phaseName) {
  const intake = phaseArgs.find((arg) => !arg.startsWith("--"));
  if (!intake) {
    console.error(`${phaseName} requires an intake folder.`);
    usage(1);
  }

  return intake;
}

function runReadiness() {
  runNode("scripts/readiness-report.mjs", phaseArgs);
}

function runIntake() {
  const intake = requireIntake("intake");
  runNpm("research:validate", ["--", intake]);
  runNpm("research:summary", ["--", intake]);
}

function runReview() {
  const intake = requireIntake("review");
  runNode("scripts/readiness-report.mjs", [intake]);
}

function runPromotePlan() {
  const intake = requireIntake("promote:plan");
  runNpm("research:dry-run", ["--", intake]);
  runNpm("research:promotion-packet", ["--", intake]);
  runNode("scripts/readiness-report.mjs", [intake]);
}

function runDeployCheck() {
  runNpm("verify");
}

function runDeploySmoke() {
  const urlIndex = phaseArgs.indexOf("--url");
  const url = urlIndex >= 0 ? phaseArgs[urlIndex + 1] : undefined;

  if (!url) {
    console.error("deploy:smoke requires --url <deployed-url>.");
    usage(1);
  }

  runCommand("npm", ["run", "smoke"], {
    cwd: path.join(repoRoot, "app"),
    env: {
      ...process.env,
      DEAL_FINDER_SMOKE_BASE_URL: url,
      DEAL_FINDER_SMOKE_ADMIN_MODE: "disabled",
      DEAL_FINDER_SMOKE_SKIP_REPORT_POST: "1"
    }
  });
}

function notImplemented(name, reason) {
  return () => {
    console.error(`ops ${name} is not implemented yet.`);
    console.error(reason);
    process.exit(1);
  };
}

if (!phase || phase === "--help" || phase === "-h") {
  usage(phase ? 0 : 1);
}

const runner = phases.get(phase);
if (!runner) {
  console.error(`Unknown ops phase: ${phase}`);
  usage(1);
}

runner();
