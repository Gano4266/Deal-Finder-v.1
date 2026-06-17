import crypto from "node:crypto";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  readCsv,
  repoRoot,
  validateIntakeContract,
  value
} from "./research-intake-contract.mjs";

const currentFilePath = fileURLToPath(import.meta.url);
const appRequire = createRequire(path.join(repoRoot, "app", "package.json"));
const canonicalIntakePathPattern = /^ops\/research\/intake\/[a-z0-9][a-z0-9-]*-\d{4}-\d{2}-\d{2}$/;
const allowedOfficialTiers = new Set(["tier_1_official"]);
const scraperVersion = "forkcast-official-source-scraper-v1";

function relativePath(absolutePath) {
  return path.relative(repoRoot, absolutePath).replaceAll(path.sep, "/");
}

export function sha256(textOrBuffer) {
  return `sha256:${crypto.createHash("sha256").update(textOrBuffer).digest("hex")}`;
}

function isTrue(input = "") {
  return String(input).trim().toLowerCase() === "true";
}

function sanitizeId(input) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function nowIso() {
  return new Date().toISOString();
}

function dateOnly(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function addDaysIso(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return dateOnly(date);
}

export function normalizeText(text) {
  return String(text ?? "")
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
}

function stripHtml(html) {
  return normalizeText(html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " "));
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

function readCsvWithTemplate(intakeDir, fileName) {
  const absolutePath = path.join(intakeDir, fileName);
  if (fs.existsSync(absolutePath)) {
    return { absolutePath, ...readCsv(absolutePath, fileName) };
  }

  const template = readCsv(path.join(repoRoot, "ops", "templates", `${fileName.replace(".csv", "")}-template.csv`), fileName);
  return { absolutePath, headers: template.headers, rows: [] };
}

function readCsvFile(intakeDir, fileName) {
  const absolutePath = path.join(intakeDir, fileName);
  return { absolutePath, ...readCsv(absolutePath, fileName) };
}

function upsertById(rows, idField, row) {
  const id = value(row, idField);
  const index = rows.findIndex((existing) => value(existing, idField) === id);
  if (index >= 0) {
    rows[index] = { ...rows[index], ...row };
    return "updated";
  }

  rows.push(row);
  return "created";
}

function parseArgs(rawArgs) {
  const options = {
    dryRun: false,
    confirmTermsReviewed: false,
    screenshot: true,
    sourceIds: new Set(),
    limit: undefined
  };
  const positional = [];

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--confirm-terms-reviewed") {
      options.confirmTermsReviewed = true;
      continue;
    }

    if (arg === "--no-screenshot") {
      options.screenshot = false;
      continue;
    }

    if (arg === "--source") {
      const sourceId = rawArgs[index + 1];
      if (!sourceId) {
        throw new Error("--source requires a source_id");
      }
      options.sourceIds.add(sourceId);
      index += 1;
      continue;
    }

    if (arg === "--limit") {
      const limit = Number(rawArgs[index + 1]);
      if (!Number.isInteger(limit) || limit < 1) {
        throw new Error("--limit requires a positive integer");
      }
      options.limit = limit;
      index += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown scraper option: ${arg}`);
    }

    positional.push(arg);
  }

  return {
    intakeArg: positional[0],
    options
  };
}

export function sourceSkipReason(row, options) {
  if (!allowedOfficialTiers.has(value(row, "source_tier"))) {
    return `source_tier ${value(row, "source_tier") || "[blank]"} is not enabled for Phase 2 official scraping`;
  }

  if (!isTrue(value(row, "automation_allowed"))) {
    return "automation_allowed is not true";
  }

  if (isTrue(value(row, "permission_required"))) {
    return "permission_required is true";
  }

  if (isTrue(value(row, "login_required"))) {
    return "login_required is true";
  }

  if (value(row, "source_status") && value(row, "source_status") !== "active") {
    return `source_status is ${value(row, "source_status")}`;
  }

  if (value(row, "robots_or_terms_notes") && !options.confirmTermsReviewed) {
    return "robots_or_terms_notes present; rerun with --confirm-terms-reviewed after review";
  }

  if (!value(row, "source_url")) {
    return "missing source_url";
  }

  return undefined;
}

export function selectSources(rows, options) {
  const selected = [];
  const skipped = [];
  const seenSourceIds = new Set();

  rows.forEach((row) => {
    const sourceId = value(row, "source_id");
    if (sourceId) {
      seenSourceIds.add(sourceId);
    }

    if (options.sourceIds.size > 0 && !options.sourceIds.has(value(row, "source_id"))) {
      return;
    }

    const reason = sourceSkipReason(row, options);
    if (reason) {
      skipped.push({
        source_id: value(row, "source_id"),
        restaurant_id: value(row, "restaurant_id"),
        source_url: value(row, "source_url"),
        reason
      });
      return;
    }

    selected.push(row);
  });

  return {
    selected: typeof options.limit === "number" ? selected.slice(0, options.limit) : selected,
    skipped,
    missingRequested: [...options.sourceIds].filter((sourceId) => !seenSourceIds.has(sourceId))
  };
}

async function captureWithPlaywright(source, outputPaths, options) {
  let chromium;
  try {
    ({ chromium } = appRequire("playwright"));
  } catch (error) {
    throw new Error(`Playwright is unavailable: ${error.message}`);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 1600 },
      userAgent: "Forkcast research capture bot; contact operator before production automation"
    });
    const response = await page.goto(value(source, "source_url"), {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => undefined);

    const html = await page.content();
    const title = await page.title();
    const text = normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => stripHtml(html)));
    let screenshotHash = "";

    if (options.screenshot) {
      await page.screenshot({ path: outputPaths.screenshotPath, fullPage: true });
      screenshotHash = sha256(fs.readFileSync(outputPaths.screenshotPath));
    }

    return {
      ok: response ? response.ok() : true,
      html,
      text,
      title,
      finalUrl: page.url(),
      status: response?.status(),
      statusText: response ? `${response.status()} ${response.headers()["content-type"] ?? ""}`.trim() : "browser capture",
      screenshotHash
    };
  } finally {
    await browser.close();
  }
}

async function captureWithFetch(source) {
  const response = await fetch(value(source, "source_url"), {
    redirect: "follow",
    headers: {
      "user-agent": "Forkcast research capture bot; contact operator before production automation"
    }
  });
  const html = await response.text();

  return {
    ok: response.ok,
    html,
    text: stripHtml(html),
    title: "",
    finalUrl: response.url,
    status: response.status,
    statusText: `${response.status} ${response.headers.get("content-type") ?? ""}`.trim(),
    screenshotHash: ""
  };
}

async function captureSource(source, intakeDir, options) {
  const folderSlug = sanitizeId(path.basename(intakeDir));
  const sourceId = value(source, "source_id");
  const fileSlug = sanitizeId(sourceId);
  const rawDir = path.join(intakeDir, "raw");
  const screenshotDir = path.join(intakeDir, "screenshots");
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(screenshotDir, { recursive: true });

  const outputPaths = {
    htmlPath: path.join(rawDir, `${fileSlug}.html`),
    textPath: path.join(rawDir, `${fileSlug}.txt`),
    screenshotPath: path.join(screenshotDir, `${fileSlug}.png`)
  };
  const startedAt = nowIso();

  let capture;
  let captureMethod = "automated_official_fetch";
  try {
    capture = options.screenshot
      ? await captureWithPlaywright(source, outputPaths, options)
      : await captureWithFetch(source);
    captureMethod = options.screenshot ? "automated_official_browser_capture" : "automated_official_fetch";
  } catch (browserError) {
    capture = await captureWithFetch(source);
    captureMethod = "automated_official_fetch_fallback";
    capture.browserError = browserError.message;
  }

  const completedAt = nowIso();
  const normalizedText = normalizeText(capture.text);
  const assertedText = normalizedText.length > 12000
    ? `${normalizedText.slice(0, 12000)}\n[Truncated by automated capture. Full normalized source text is stored in metadata_json.evidence_file_path.]`
    : normalizedText;
  const contentHash = sha256(assertedText);
  fs.writeFileSync(outputPaths.htmlPath, capture.html, "utf8");
  fs.writeFileSync(outputPaths.textPath, `${normalizedText}\n`, "utf8");

  const htmlHash = sha256(fs.readFileSync(outputPaths.htmlPath));
  const textHash = sha256(fs.readFileSync(outputPaths.textPath));
  const cadence = Number(value(source, "expected_check_cadence_days")) || 30;
  const captureId = `cap-${folderSlug}-${fileSlug}-auto`;
  const checkId = `chk-${folderSlug}-${fileSlug}-auto`;
  const textRelativePath = relativePath(outputPaths.textPath);
  const htmlRelativePath = relativePath(outputPaths.htmlPath);
  const screenshotRelativePath = capture.screenshotHash && fs.existsSync(outputPaths.screenshotPath)
    ? relativePath(outputPaths.screenshotPath)
    : "";
  const statusOk = capture.ok && normalizedText.length > 0;
  const metadata = {
    official_url: value(source, "source_url"),
    hash_subject: "extracted_text_or_confirmation_note",
    scraper_version: scraperVersion,
    html_file_sha256: htmlHash,
    html_file_path: htmlRelativePath,
    evidence_file_sha256: textHash,
    evidence_file_path: textRelativePath
  };

  if (screenshotRelativePath) {
    metadata.screenshot_file_sha256 = capture.screenshotHash;
    metadata.screenshot_file_path = screenshotRelativePath;
  }

  if (capture.browserError) {
    metadata.browser_capture_error = capture.browserError;
  }

  return {
    source,
    sourceId,
    captureId,
    checkId,
    success: statusOk,
    captureRow: {
      source_capture_id: captureId,
      source_id: sourceId,
      restaurant_id: value(source, "restaurant_id"),
      captured_at: completedAt,
      captured_by: "forkcast_scraper",
      capture_method: captureMethod,
      source_url: value(source, "source_url"),
      source_final_url: capture.finalUrl,
      source_title: capture.title,
      source_published_at: "",
      source_observed_at: dateOnly(),
      evidence_type: "official_website_normalized_text",
      extracted_text_or_confirmation_note: assertedText,
      content_hash: contentHash,
      screenshot_path: screenshotRelativePath,
      archive_url_or_path: textRelativePath,
      metadata_json: JSON.stringify(metadata),
      capture_status: statusOk ? "captured" : "failed",
      notes: statusOk
        ? "Automated official-source capture; requires human review before promotion."
        : "Automated official-source capture failed or produced no readable text."
    },
    checkRow: {
      source_check_id: checkId,
      deal_id: "",
      restaurant_id: value(source, "restaurant_id"),
      source_id: sourceId,
      direct_confirmation_id: "",
      source_capture_id_before: "",
      source_capture_id_after: statusOk ? captureId : "",
      checked_at: completedAt,
      checked_by: "forkcast_scraper",
      check_type: "automated_official_source_capture",
      started_at: startedAt,
      completed_at: completedAt,
      source_tier: value(source, "source_tier"),
      source_url: value(source, "source_url"),
      previous_result: "",
      result: statusOk ? "confirmed" : "failed",
      result_detail: statusOk
        ? "Official source was reachable and captured into intake artifacts. This does not confirm any deal or approve publication."
        : "Official source could not be captured into readable text.",
      http_status_or_access_result: capture.statusText,
      confidence_status_before: "",
      confidence_status_after: statusOk ? "probable" : "unverified",
      workflow_status_before: "",
      workflow_status_after: "needs_review",
      change_detected: "false",
      changed_fields: "source_capture",
      action_taken: statusOk ? "source_capture_created" : "manual_check_required",
      affected_deal_ids: "",
      evidence_url_or_path: statusOk ? textRelativePath : "",
      archive_url_or_path: statusOk ? htmlRelativePath : "",
      screenshot_path: screenshotRelativePath,
      content_hash: contentHash,
      assigned_to: "",
      resolved_at: "",
      notes: isTrue(value(source, "requires_manual_check"))
        ? "Source row requires manual check; automated capture is review input only."
        : "Automated capture is review input only.",
      next_check_due: addDaysIso(cadence)
    },
    inventoryPatch: {
      last_successful_check_at: statusOk ? dateOnly() : value(source, "last_successful_check_at"),
      last_failed_check_at: statusOk ? "" : dateOnly(),
      failure_reason: statusOk ? "" : "automated capture failed or produced no readable text",
      next_check_due: addDaysIso(cadence),
      evidence_storage_path: statusOk ? textRelativePath : value(source, "evidence_storage_path")
    },
    artifacts: {
      text: textRelativePath,
      html: htmlRelativePath,
      screenshot: screenshotRelativePath
    }
  };
}

function failedCaptureResult(source, intakeDir, error) {
  const folderSlug = sanitizeId(path.basename(intakeDir));
  const sourceId = value(source, "source_id");
  const fileSlug = sanitizeId(sourceId);
  const cadence = Number(value(source, "expected_check_cadence_days")) || 30;
  const completedAt = nowIso();
  const checkId = `chk-${folderSlug}-${fileSlug}-auto`;

  return {
    source,
    sourceId,
    captureId: "",
    checkId,
    success: false,
    captureRow: undefined,
    checkRow: {
      source_check_id: checkId,
      deal_id: "",
      restaurant_id: value(source, "restaurant_id"),
      source_id: sourceId,
      direct_confirmation_id: "",
      source_capture_id_before: "",
      source_capture_id_after: "",
      checked_at: completedAt,
      checked_by: "forkcast_scraper",
      check_type: "automated_official_source_capture",
      started_at: completedAt,
      completed_at: completedAt,
      source_tier: value(source, "source_tier"),
      source_url: value(source, "source_url"),
      previous_result: "",
      result: "failed",
      result_detail: `Official source capture failed before readable artifacts could be written: ${error.message}`,
      http_status_or_access_result: "capture_exception",
      confidence_status_before: "",
      confidence_status_after: "unverified",
      workflow_status_before: "",
      workflow_status_after: "needs_review",
      change_detected: "false",
      changed_fields: "source_capture",
      action_taken: "manual_check_required",
      affected_deal_ids: "",
      evidence_url_or_path: "",
      archive_url_or_path: "",
      screenshot_path: "",
      content_hash: "",
      assigned_to: "",
      resolved_at: "",
      notes: "Automated capture failed; manual source check required.",
      next_check_due: addDaysIso(cadence)
    },
    inventoryPatch: {
      last_successful_check_at: value(source, "last_successful_check_at"),
      last_failed_check_at: dateOnly(),
      failure_reason: "automated capture exception",
      next_check_due: addDaysIso(cadence),
      evidence_storage_path: value(source, "evidence_storage_path")
    },
    artifacts: {
      text: "",
      html: "",
      screenshot: ""
    }
  };
}

function applyResults(intakeDir, results) {
  const inventory = readCsvFile(intakeDir, "source-inventory.csv");
  const captures = readCsvWithTemplate(intakeDir, "source-captures.csv");
  const checks = readCsvWithTemplate(intakeDir, "source-checks.csv");

  const mutations = [];
  results.forEach((result) => {
    const inventoryIndex = inventory.rows.findIndex((row) => value(row, "source_id") === result.sourceId);
    if (inventoryIndex >= 0) {
      inventory.rows[inventoryIndex] = {
        ...inventory.rows[inventoryIndex],
        ...result.inventoryPatch
      };
      mutations.push(`updated source-inventory.csv ${result.sourceId}`);
    }

    if (result.captureRow) {
      mutations.push(`${upsertById(captures.rows, "source_capture_id", result.captureRow)} source-captures.csv ${result.captureId}`);
    }
    mutations.push(`${upsertById(checks.rows, "source_check_id", result.checkRow)} source-checks.csv ${result.checkId}`);
  });

  writeCsv(inventory.absolutePath, inventory.headers, inventory.rows);
  writeCsv(captures.absolutePath, captures.headers, captures.rows);
  writeCsv(checks.absolutePath, checks.headers, checks.rows);

  const resultPath = path.join(intakeDir, "raw", "scrape-results.json");
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  fs.writeFileSync(resultPath, `${JSON.stringify({
    generated_at: nowIso(),
    scraper_version: scraperVersion,
    results: results.map((result) => ({
      source_id: result.sourceId,
      capture_id: result.captureId,
      check_id: result.checkId,
      success: result.success,
      artifacts: result.artifacts
    }))
  }, null, 2)}\n`, "utf8");
  mutations.push(`wrote ${relativePath(resultPath)}`);

  return mutations;
}

export async function runScrape({ intakeDir, options }) {
  const contract = validateIntakeContract(intakeDir);
  const intakeRelativePath = relativePath(intakeDir);

  if (!canonicalIntakePathPattern.test(intakeRelativePath)) {
    throw new Error("intake path must be canonical: ops/research/intake/<area>-YYYY-MM-DD");
  }

  if (contract.failures.length > 0) {
    throw new Error(`intake contract failed: ${contract.failures.join("; ")}`);
  }

  const inventory = readCsvFile(intakeDir, "source-inventory.csv");
  const { selected, skipped, missingRequested } = selectSources(inventory.rows, options);

  if (options.dryRun) {
    return {
      intakeFolder: intakeRelativePath,
      dryRunOnly: true,
      selected: selected.map((row) => ({
        source_id: value(row, "source_id"),
        restaurant_id: value(row, "restaurant_id"),
        source_url: value(row, "source_url")
      })),
      skipped,
      missingRequested,
      mutations: []
    };
  }

  if (selected.length === 0) {
    return {
      intakeFolder: intakeRelativePath,
      dryRunOnly: false,
      selected: [],
      skipped,
      missingRequested,
      mutations: []
    };
  }

  const results = [];
  for (const source of selected) {
    try {
      results.push(await captureSource(source, intakeDir, options));
    } catch (error) {
      results.push(failedCaptureResult(source, intakeDir, error));
    }
  }

  const mutations = applyResults(intakeDir, results);

  return {
    intakeFolder: intakeRelativePath,
    dryRunOnly: false,
    selected: results.map((result) => ({
      source_id: result.sourceId,
      restaurant_id: value(result.source, "restaurant_id"),
      source_url: value(result.source, "source_url"),
      success: result.success,
      capture_id: result.captureId,
      check_id: result.checkId,
      artifacts: result.artifacts
    })),
    skipped,
    missingRequested,
    mutations
  };
}

function printReport(report) {
  console.log(`Official source scrape: ${report.intakeFolder}`);
  console.log(report.dryRunOnly
    ? "Dry run only. No network capture or file writes."
    : "Capture-only. No fixture edits, approvals, promotions, or public route hydration.");

  console.log(`\nSelected sources: ${report.selected.length}`);
  report.selected.forEach((source) => {
    console.log(`- ${source.source_id} (${source.restaurant_id}) ${source.source_url}${source.success === false ? " [failed]" : ""}`);
    if (source.capture_id) {
      console.log(`  capture: ${source.capture_id}`);
      console.log(`  check: ${source.check_id}`);
    }
  });

  console.log(`\nSkipped sources: ${report.skipped.length}`);
  report.skipped.forEach((source) => {
    console.log(`- ${source.source_id || "[missing source_id]"} (${source.restaurant_id}) ${source.reason}`);
  });

  if (report.missingRequested?.length > 0) {
    console.log(`\nRequested sources not found: ${report.missingRequested.length}`);
    report.missingRequested.forEach((sourceId) => console.log(`- ${sourceId}`));
  }

  if (report.mutations.length > 0) {
    console.log("\nWrites");
    report.mutations.forEach((mutation) => console.log(`- ${mutation}`));
  }

  if (report.selected.length === 0) {
    console.log("\nNext action: review skipped/not-found sources or pass --confirm-terms-reviewed after source terms review.");
  } else {
    console.log("\nNext action: run npm run research:validate and npm run ops -- readiness for this intake.");
  }
}

async function runCli() {
  const rawArgs = process.argv.slice(2);

  if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
    console.log("Usage: node scripts/scrape-official-sources.mjs ops/research/intake/<area>-YYYY-MM-DD [--dry-run] [--source <source_id>] [--limit <n>] [--no-screenshot] [--confirm-terms-reviewed]");
    process.exit(0);
  }

  const { intakeArg, options } = parseArgs(rawArgs);
  if (!intakeArg) {
    console.error("Missing intake folder.");
    process.exit(1);
  }

  const intakeDir = path.resolve(process.cwd(), intakeArg);
  if (!fs.existsSync(intakeDir) || !fs.statSync(intakeDir).isDirectory()) {
    console.error(`Research intake folder not found: ${intakeArg}`);
    process.exit(1);
  }

  try {
    const report = await runScrape({ intakeDir, options });
    printReport(report);
  } catch (error) {
    console.error(`Official source scrape failed: ${error.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  runCli();
}
