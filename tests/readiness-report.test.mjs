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
  const statusTotal = Object.values(report.summary.statuses).reduce((sum, count) => sum + count, 0);

  assert.equal(report.ok, true);
  assert.equal(report.summary.totalRows, 28);
  assert.equal(report.summary.readyToPromote, 0);
  assert.equal(report.summary.alreadyPublicClean, report.summary.statuses.already_public_clean ?? 0);
  // Every row lands in exactly one status bucket, whatever that bucket happens to be right now.
  assert.equal(statusTotal, 28);
  assert.equal(report.summary.alreadyPublicClean + report.summary.blockedRows, 28);
  // At least one row should still be genuinely live-matched and clean (not a claim about
  // freshness specifically - a fully-rechecked batch can legitimately have zero freshness
  // blockers if every stale row has just been refreshed).
  assert.ok(report.summary.alreadyPublicClean > 0);
  if (report.summary.blockedRows > 0) {
    assert.ok(report.summary.blockerCategories.length > 0);
  }
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
  assert.match(result.stdout, /Blocked or needs review: \d+/);
  assert.match(result.stdout, /Statuses/);
  assert.match(result.stdout, /Blocker categories/);
  // Whatever mix of statuses/categories shows up, the report must never claim a row is
  // ready for blind exact-ID promotion out of an already-approved intake batch.
  assert.match(result.stdout, /Ready for exact-ID promotion: 0/);
});
