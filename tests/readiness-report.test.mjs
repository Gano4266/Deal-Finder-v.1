import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { buildReadinessReport } from "../scripts/readiness-report.mjs";
import { repoRoot } from "../scripts/research-intake-contract.mjs";

function intakePath(relativePath) {
  return path.join(repoRoot, relativePath);
}

test("June 13 approved intake rows are recognized as already public and clean", () => {
  const report = buildReadinessReport(intakePath("ops/research/intake/wilmington-2026-06-13"));
  const alreadyPublicClean = report.summary.statuses.already_public_clean ?? 0;
  const publicFixtureNeedsReview = report.summary.statuses.public_fixture_needs_review ?? 0;

  assert.equal(report.ok, true);
  assert.equal(report.summary.totalRows, 28);
  assert.equal(report.summary.readyToPromote, 0);
  assert.equal(report.summary.alreadyPublicClean, alreadyPublicClean);
  assert.equal(alreadyPublicClean + publicFixtureNeedsReview, 28);
  assert.equal(publicFixtureNeedsReview, report.summary.blockedRows);
  assert.equal(
    report.summary.blockerCategories.some((item) => item.category === "freshness"),
    true
  );
});

test("June 3 review-only intake rows remain blocked instead of promotable", () => {
  const report = buildReadinessReport(intakePath("ops/research/intake/wilmington-2026-06-03"));

  assert.equal(report.ok, true);
  assert.equal(report.summary.totalRows, 34);
  assert.equal(report.summary.readyToPromote, 0);
  assert.equal(report.summary.blockedRows, 34);
  assert.equal(report.summary.statuses.already_public_clean ?? 0, 0);
});

test("dry-run promotion plan uses readiness status for already-public rows", () => {
  const result = spawnSync(
    "npm",
    ["run", "research:dry-run", "--", "ops/research/intake/wilmington-2026-06-13"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      shell: false
    }
  );

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Already public \/ fixture-clean: \d+/);
  assert.match(result.stdout, /public_fixture_needs_review: \d+/);
  assert.match(result.stdout, /freshness/);
  assert.doesNotMatch(result.stdout, /Rows blocked only by public fixture metadata: 28/);
});
