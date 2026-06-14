import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { repoRoot } from "../scripts/research-intake-contract.mjs";

const proxyPath = path.join(repoRoot, "app", "proxy.ts");

test("production admin routes are disabled by default", () => {
  const proxy = fs.readFileSync(proxyPath, "utf8");

  assert.match(proxy, /NODE_ENV\s*===\s*"production"/);
  assert.match(proxy, /DEAL_FINDER_ADMIN_ENABLED\s*!==\s*"true"/);
  assert.match(proxy, /status:\s*404/);
  assert.match(proxy, /matcher:\s*\[\s*"\/admin\/:path\*"\s*\]/);
});
