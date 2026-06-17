import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { buildPromotionPlan } from "../scripts/promote-reviewed-fixtures.mjs";
import { repoRoot } from "../scripts/research-intake-contract.mjs";

function intakePath(relativePath) {
  return path.join(repoRoot, relativePath);
}

test("Phase 3 apply requires exact deal IDs", () => {
  const plan = buildPromotionPlan({
    intakeDir: intakePath("ops/research/intake/wilmington-2026-06-13"),
    options: {
      writeReviewedFixtures: false,
      dealIds: []
    }
  });

  assert.equal(plan.safeToWrite, false);
  assert.equal(plan.errors.includes("Phase 3 requires at least one exact --deal <deal_id>"), true);
});

test("already-public deals are blocked from exact apply rewrites", () => {
  const plan = buildPromotionPlan({
    intakeDir: intakePath("ops/research/intake/wilmington-2026-06-13"),
    options: {
      writeReviewedFixtures: false,
      dealIds: ["deal-wilmington-k38-porters-neck-monday-5-food-items"]
    }
  });

  assert.equal(plan.safeToWrite, false);
  assert.equal(
    plan.errors.some((error) => error.includes("public fixture deal already exists")),
    true
  );
});

test("broad all-row promotion is refused by the CLI", () => {
  const result = spawnSync(
    "node",
    [
      "scripts/promote-reviewed-fixtures.mjs",
      "ops/research/intake/wilmington-2026-06-13",
      "--all-promotable"
    ],
    {
      cwd: repoRoot,
      encoding: "utf8",
      shell: false
    }
  );

  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /exact --deal IDs/);
});
