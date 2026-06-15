import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { buildReadinessReport } from "../scripts/readiness-report.mjs";
import { repoRoot } from "../scripts/research-intake-contract.mjs";

function intakePath(relativePath) {
  return path.join(repoRoot, relativePath);
}

test("June 13 approved intake rows are recognized as already public and clean", () => {
  const report = buildReadinessReport(intakePath("ops/research/intake/wilmington-2026-06-13"));

  assert.equal(report.ok, true);
  assert.equal(report.summary.totalRows, 28);
  assert.equal(report.summary.alreadyPublicClean, 28);
  assert.equal(report.summary.readyToPromote, 0);
  assert.equal(report.summary.blockedRows, 0);
});

test("June 3 review-only intake rows remain blocked instead of promotable", () => {
  const report = buildReadinessReport(intakePath("ops/research/intake/wilmington-2026-06-03"));

  assert.equal(report.ok, true);
  assert.equal(report.summary.totalRows, 34);
  assert.equal(report.summary.readyToPromote, 0);
  assert.equal(report.summary.blockedRows, 34);
  assert.equal(report.summary.statuses.already_public_clean ?? 0, 0);
});
