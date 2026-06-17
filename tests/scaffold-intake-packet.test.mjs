import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createIntakeScaffold } from "../scripts/scaffold-intake-packet.mjs";
import {
  csvIntakeFiles,
  readCsv,
  repoRoot,
  requiredIntakeFiles,
  templateByFile
} from "../scripts/research-intake-contract.mjs";

test("intake scaffold creates canonical packet from template headers", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "forkcast-intake-new-"));
  const result = createIntakeScaffold({
    area: "Downtown Wilmington",
    options: {
      date: "2026-06-15",
      areaName: "Downtown Wilmington"
    },
    root: tempRoot,
    templateRoot: repoRoot
  });

  assert.equal(result.created, true);
  assert.equal(result.intakeRelativePath, "ops/research/intake/downtown-wilmington-2026-06-15");

  for (const fileName of requiredIntakeFiles) {
    assert.equal(fs.existsSync(path.join(tempRoot, result.intakeRelativePath, fileName)), true);
  }

  for (const fileName of csvIntakeFiles) {
    const generated = readCsv(path.join(tempRoot, result.intakeRelativePath, fileName), fileName);
    const template = readCsv(path.join(repoRoot, templateByFile.get(fileName)), templateByFile.get(fileName));

    assert.deepEqual(generated.headers, template.headers);
    assert.equal(generated.rows.length, 0);
  }

  const brief = JSON.parse(fs.readFileSync(path.join(tempRoot, result.intakeRelativePath, "area_brief.json"), "utf8"));
  assert.equal(brief.area_name, "Downtown Wilmington");
  assert.equal(brief.created_at, "2026-06-15");
  assert.equal(fs.existsSync(path.join(tempRoot, result.intakeRelativePath, "raw/.gitkeep")), true);
  assert.equal(fs.existsSync(path.join(tempRoot, result.intakeRelativePath, "screenshots/.gitkeep")), true);
});

test("intake scaffold refuses to overwrite an existing packet", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "forkcast-intake-existing-"));
  const options = { date: "2026-06-15" };

  createIntakeScaffold({
    area: "wilmington",
    options,
    root: tempRoot,
    templateRoot: repoRoot
  });

  assert.throws(
    () => createIntakeScaffold({
      area: "wilmington",
      options,
      root: tempRoot,
      templateRoot: repoRoot
    }),
    /already exists/
  );
});
