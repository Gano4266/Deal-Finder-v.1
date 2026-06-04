import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateIntakeContract } from "./research-intake-contract.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const allowedSourceTiers = new Set([
  "tier_1_official",
  "tier_2_official_social",
  "tier_3_partner",
  "tier_4_secondary",
  "tier_5_user_reported"
]);
const allowedConfidenceStatuses = new Set(["verified", "probable", "unverified"]);
const allowedWorkflowStatuses = new Set([
  "lead",
  "needs_review",
  "approved",
  "approved_with_uncertainty",
  "rejected",
  "needs_recheck",
  "expired",
  "superseded"
]);

const expectedFiles = [
  { file: "area_brief.json", type: "json", optional: true },
  {
    file: "restaurant-source-list.csv",
    type: "csv",
    optional: true,
    template: "ops/templates/restaurant-source-list.csv"
  },
  {
    file: "source-inventory.csv",
    type: "csv",
    optional: true,
    template: "ops/templates/source-inventory-template.csv"
  },
  {
    file: "source-captures.csv",
    type: "csv",
    optional: true,
    template: "ops/templates/source-captures-template.csv"
  },
  {
    file: "deal-intake.csv",
    type: "csv",
    optional: true,
    template: "ops/templates/deal-intake-template.csv"
  },
  {
    file: "review-tasks.csv",
    type: "csv",
    optional: true,
    template: "ops/templates/review-tasks-template.csv"
  }
];

const aiSourcePattern = /\b(gpt|chatgpt|deep research|ai|llm|language model|openai|claude|gemini|copilot)\b/i;
const directConfirmationPattern = /direct[_ -]?confirmation/i;
const discoveryOnlyPattern = /\b(search snippet|snippet|blog|review|reddit|yelp|google review|tripadvisor|tourism|tourism page|comment|user note|user tip)\b/i;
const volatileEvidenceTypes = new Set(["social_post", "story", "pdf", "image_post", "menu_image", "screenshot", "email"]);

const failures = [];
const warnings = [];
let presentFileCount = 0;
let rowCount = 0;

function parseCsvLine(line, label) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (inQuotes) {
    throw new Error(`${label}: unterminated quoted CSV field`);
  }

  values.push(current);
  return values;
}

function readCsv(absolutePath, label) {
  const text = fs.readFileSync(absolutePath, "utf8").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();
  if (!text) {
    return { headers: [], rows: [] };
  }

  const [headerLine, ...lines] = text.split("\n");
  const headers = parseCsvLine(headerLine, `${label}: header`);
  const rows = [];

  lines.filter(Boolean).forEach((line, index) => {
    const values = parseCsvLine(line, `${label}: row ${index + 2}`);
    if (values.length !== headers.length) {
      failures.push(`${label}: row ${index + 2} has ${values.length} fields, expected ${headers.length}`);
      return;
    }

    rows.push(Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] ?? ""])));
  });

  return { headers, rows };
}

function location(file, rowIndex) {
  return rowIndex === undefined ? file : `${file}: row ${rowIndex + 2}`;
}

function value(row, field) {
  return row[field]?.trim() ?? "";
}

function isTrue(input) {
  return input.trim().toLowerCase() === "true";
}

function isDirectConfirmationRow(row) {
  return Boolean(value(row, "direct_confirmation_id")) ||
    directConfirmationPattern.test(value(row, "source_type")) ||
    directConfirmationPattern.test(value(row, "evidence_type")) ||
    directConfirmationPattern.test(value(row, "source_name"));
}

function hasAny(row, fields) {
  return fields.some((field) => Boolean(value(row, field)));
}

function validateHeaders(file, headers, templatePath) {
  const template = readCsv(path.join(repoRoot, templatePath), templatePath);
  const presentHeaders = new Set(headers);
  const missingHeaders = template.headers.filter((header) => !presentHeaders.has(header));

  if (missingHeaders.length > 0) {
    failures.push(`${file}: missing required template headers: ${missingHeaders.join(", ")}`);
  }
}

function validateEnum(row, file, rowIndex, field, allowedValues) {
  if (!(field in row)) {
    return;
  }

  const currentValue = value(row, field);
  if (!currentValue) {
    warnings.push(`${location(file, rowIndex)}: missing ${field}`);
    return;
  }

  if (!allowedValues.has(currentValue)) {
    failures.push(`${location(file, rowIndex)}: ${field} has non-canonical value "${currentValue}"`);
  }
}

function validateAiSourceMisuse(row, file, rowIndex) {
  const label = location(file, rowIndex);
  const sourceName = value(row, "source_name");
  const sourceType = value(row, "source_type");
  const sourceUrl = value(row, "source_url");
  const finalProofFields = [
    sourceName,
    sourceType,
    sourceUrl,
    value(row, "evidence_type"),
    value(row, "evidence_summary"),
    value(row, "source_quote"),
    value(row, "review_reason"),
    value(row, "notes")
  ].join(" ");

  if (sourceName && aiSourcePattern.test(sourceName)) {
    failures.push(`${label}: source_name appears to treat AI output as a source`);
  }

  if (sourceType && aiSourcePattern.test(sourceType)) {
    failures.push(`${label}: source_type appears to treat AI output as a source`);
  }

  if (!sourceUrl && !isDirectConfirmationRow(row) && ("source_url" in row)) {
    failures.push(`${label}: source_url is blank for a non-direct-confirmation row`);
  }

  if (discoveryOnlyPattern.test(finalProofFields)) {
    const approved = ["approved", "approved_with_uncertainty"].includes(value(row, "workflow_status"));
    const hasDirectConfirmation = Boolean(value(row, "direct_confirmation_id"));
    const sourceTier = value(row, "source_tier");

    if (approved || ((sourceTier === "tier_4_secondary" || sourceTier === "tier_5_user_reported") && !hasDirectConfirmation)) {
      warnings.push(`${label}: appears to use discovery-only material as proof; keep as lead until independently confirmed`);
    }
  }
}

function validateApprovalSafety(row, file, rowIndex) {
  const workflowStatus = value(row, "workflow_status");
  if (!["approved", "approved_with_uncertainty"].includes(workflowStatus)) {
    return;
  }

  const label = location(file, rowIndex);
  const sourceTier = value(row, "source_tier");

  if (!sourceTier) {
    failures.push(`${label}: approved row needs source_tier`);
  }

  if (!value(row, "confidence_status")) {
    failures.push(`${label}: approved row needs confidence_status`);
  }

  if (!hasAny(row, ["source_capture_id", "direct_confirmation_id"])) {
    failures.push(`${label}: approved row needs source_capture_id or direct_confirmation_id`);
  }

  if (!value(row, "source_quote")) {
    failures.push(`${label}: approved row needs source_quote`);
  }

  if (value(row, "confidence_status") === "unverified") {
    failures.push(`${label}: approved row cannot have confidence_status=unverified`);
  }

  if (!hasAny(row, ["next_check_due", "expires_on"])) {
    failures.push(`${label}: approved row needs next_check_due or expires_on`);
  }

  if (value(row, "review_decision") !== "approved") {
    failures.push(`${label}: approved row needs review_decision=approved`);
  }

  if (!value(row, "reviewed_by")) {
    failures.push(`${label}: approved row needs reviewed_by`);
  }

  if (!value(row, "reviewed_at")) {
    failures.push(`${label}: approved row needs reviewed_at`);
  }

  if (isTrue(value(row, "mvp_publish_eligible")) && !isTrue(value(row, "public_copy_approved"))) {
    failures.push(`${label}: mvp_publish_eligible=true requires public_copy_approved=true`);
  }

  if ((sourceTier === "tier_4_secondary" || sourceTier === "tier_5_user_reported") && !value(row, "direct_confirmation_id")) {
    failures.push(`${label}: ${sourceTier} cannot support approved status without direct_confirmation_id`);
  }

  if (isTrue(value(row, "conflict_detected"))) {
    failures.push(`${label}: approved row cannot have conflict_detected=true`);
  }

  if (!hasAny(row, ["screenshot_path", "archive_url_or_path", "evidence_url_or_path"])) {
    failures.push(`${label}: approved row needs screenshot_path, archive_url_or_path, or evidence_url_or_path`);
  }

  for (const field of ["dine_in", "takeout", "delivery"]) {
    if (!value(row, field)) {
      failures.push(`${label}: approved row needs explicit ${field} applicability`);
    }
  }
}

function validateSourceCapture(row, file, rowIndex) {
  const label = location(file, rowIndex);
  const evidenceType = value(row, "evidence_type");

  if (volatileEvidenceTypes.has(evidenceType) && !hasAny(row, ["screenshot_path", "archive_url_or_path"])) {
    warnings.push(`${label}: volatile evidence_type=${evidenceType} should include screenshot_path or archive_url_or_path`);
  }

  for (const field of ["captured_at", "captured_by", "source_url", "extracted_text_or_confirmation_note"]) {
    if (!value(row, field)) {
      warnings.push(`${label}: missing ${field}`);
    }
  }
}

function validateDealIntakeServiceMode(row, file, rowIndex) {
  const missingFields = ["dine_in", "takeout", "delivery"].filter((field) => !value(row, field));
  if (missingFields.length > 0) {
    warnings.push(`${location(file, rowIndex)}: missing service-mode applicability: ${missingFields.join(", ")}`);
  }
}

function validateCsvFile(intakeDir, spec) {
  const absolutePath = path.join(intakeDir, spec.file);
  if (!fs.existsSync(absolutePath)) {
    warnings.push(`${spec.file}: optional intake file is missing`);
    return;
  }

  presentFileCount += 1;
  const csv = readCsv(absolutePath, spec.file);
  validateHeaders(spec.file, csv.headers, spec.template);
  rowCount += csv.rows.length;

  csv.rows.forEach((row, rowIndex) => {
    validateEnum(row, spec.file, rowIndex, "source_tier", allowedSourceTiers);
    validateEnum(row, spec.file, rowIndex, "confidence_status", allowedConfidenceStatuses);
    validateEnum(row, spec.file, rowIndex, "workflow_status", allowedWorkflowStatuses);
    validateAiSourceMisuse(row, spec.file, rowIndex);

    if (spec.file === "deal-intake.csv") {
      validateDealIntakeServiceMode(row, spec.file, rowIndex);
      validateApprovalSafety(row, spec.file, rowIndex);
    }

    if (spec.file === "source-captures.csv") {
      validateSourceCapture(row, spec.file, rowIndex);
    }
  });
}

function validateAreaBrief(intakeDir) {
  const file = "area_brief.json";
  const absolutePath = path.join(intakeDir, file);
  if (!fs.existsSync(absolutePath)) {
    warnings.push(`${file}: optional intake file is missing`);
    return;
  }

  presentFileCount += 1;

  try {
    JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    failures.push(`${file}: invalid JSON`);
  }
}

function printList(title, items) {
  const uniqueItems = [...new Set(items)];
  if (items.length === 0) {
    return;
  }

  console.log(`\n${title}`);
  uniqueItems.forEach((item) => console.log(`- ${item}`));
}

const intakeArg = process.argv[2];
if (!intakeArg) {
  console.error("Usage: node scripts/validate-research-intake.mjs ops/research/intake/[folder-name]");
  process.exit(1);
}

const intakeDir = path.resolve(process.cwd(), intakeArg);
if (!fs.existsSync(intakeDir) || !fs.statSync(intakeDir).isDirectory()) {
  console.error(`Research intake folder not found: ${intakeArg}`);
  process.exit(1);
}

const contract = validateIntakeContract(intakeDir);
warnings.push(...contract.warnings);
failures.push(...contract.failures);

for (const spec of expectedFiles) {
  if (spec.type === "json") {
    validateAreaBrief(intakeDir);
  } else {
    validateCsvFile(intakeDir, spec);
  }
}

const uniqueWarnings = [...new Set(warnings)];
const uniqueFailures = [...new Set(failures)];

printList("Warnings", uniqueWarnings);
printList("Failures", uniqueFailures);

if (uniqueFailures.length > 0) {
  console.error(`\nResearch intake validation failed with ${uniqueFailures.length} failure(s) and ${uniqueWarnings.length} warning(s).`);
  process.exit(1);
}

console.log(
  `\nResearch intake validation passed for ${path.relative(repoRoot, intakeDir)}: ` +
    `${presentFileCount} file(s), ${rowCount} CSV row(s), ${uniqueWarnings.length} warning(s).`
);
