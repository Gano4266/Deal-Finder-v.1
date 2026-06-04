import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const requiredIntakeFiles = [
  "area_brief.json",
  "restaurant-source-list.csv",
  "source-inventory.csv",
  "source-captures.csv",
  "deal-intake.csv",
  "review-tasks.csv"
];

export const csvIntakeFiles = [
  "restaurant-source-list.csv",
  "source-inventory.csv",
  "source-captures.csv",
  "deal-intake.csv",
  "review-tasks.csv",
  "source-checks.csv",
  "direct-confirmations.csv",
  "audit-events.csv"
];

export const templateByFile = new Map([
  ["restaurant-source-list.csv", "ops/templates/restaurant-source-list.csv"],
  ["source-inventory.csv", "ops/templates/source-inventory-template.csv"],
  ["source-captures.csv", "ops/templates/source-captures-template.csv"],
  ["deal-intake.csv", "ops/templates/deal-intake-template.csv"],
  ["review-tasks.csv", "ops/templates/review-tasks-template.csv"],
  ["source-checks.csv", "ops/templates/source-checks-template.csv"],
  ["direct-confirmations.csv", "ops/templates/direct-confirmations-template.csv"],
  ["audit-events.csv", "ops/templates/audit-events-template.csv"]
]);

const datedIntakePathPattern = /^ops\/research\/intake\/[a-z0-9][a-z0-9-]*-\d{4}-\d{2}-\d{2}$/;
const exampleTextPattern = /\b(example|fake|compatibility validation only|not restaurant data)\b/i;

export function parseCsvLine(line, label) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === "\"" && inQuotes && next === "\"") {
      current += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
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

export function readCsv(absolutePath, label) {
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
      throw new Error(`${label}: row ${index + 2} has ${values.length} fields, expected ${headers.length}`);
    }

    rows.push(Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] ?? ""])));
  });

  return { headers, rows };
}

export function value(row, field) {
  return row[field]?.trim() ?? "";
}

export function rowLabel(row, index) {
  return value(row, "deal_id") ||
    value(row, "candidate_id") ||
    value(row, "review_task_id") ||
    value(row, "source_capture_id") ||
    value(row, "source_check_id") ||
    value(row, "direct_confirmation_id") ||
    value(row, "source_id") ||
    value(row, "restaurant_id") ||
    `row ${index + 2}`;
}

function relativeIntakePath(intakeDir) {
  return path.relative(repoRoot, intakeDir).replaceAll(path.sep, "/");
}

function readAreaBrief(intakeDir, failures) {
  const briefPath = path.join(intakeDir, "area_brief.json");
  if (!fs.existsSync(briefPath)) {
    return undefined;
  }

  try {
    return JSON.parse(fs.readFileSync(briefPath, "utf8"));
  } catch {
    failures.push("area_brief.json: invalid JSON");
    return undefined;
  }
}

function isExampleOnly(intakeDir, areaBrief) {
  if (path.basename(intakeDir) !== "example-area") {
    return false;
  }

  return exampleTextPattern.test([
    areaBrief?.area_name,
    areaBrief?.research_mode,
    areaBrief?.notes
  ].filter(Boolean).join(" "));
}

function loadCsvFiles(intakeDir, warnings, failures) {
  const files = {};

  csvIntakeFiles.forEach((file) => {
    const absolutePath = path.join(intakeDir, file);
    if (!fs.existsSync(absolutePath)) {
      files[file] = { headers: [], rows: [], present: false };
      return;
    }

    try {
      files[file] = { ...readCsv(absolutePath, file), present: true };
      validateTemplateHeaders(file, files[file].headers, failures);
    } catch (error) {
      failures.push(error.message);
      files[file] = { headers: [], rows: [], present: true };
    }

    if (files[file].present && files[file].rows.length === 0) {
      warnings.push(`${file}: present but has no data rows`);
    }
  });

  return files;
}

function validateTemplateHeaders(file, headers, failures) {
  const templatePath = templateByFile.get(file);
  if (!templatePath) {
    return;
  }

  const template = readCsv(path.join(repoRoot, templatePath), templatePath);
  const presentHeaders = new Set(headers);
  const missingHeaders = template.headers.filter((header) => !presentHeaders.has(header));

  if (missingHeaders.length > 0) {
    failures.push(`${file}: missing required template headers: ${missingHeaders.join(", ")}`);
  }
}

function idsFor(rows, field) {
  return new Set(rows.map((row) => value(row, field)).filter(Boolean));
}

function validateUniqueIds({ failures, rows, file, field }) {
  const seen = new Map();

  rows.forEach((row, index) => {
    const id = value(row, field);
    if (!id) {
      return;
    }

    if (seen.has(id)) {
      failures.push(`${file}: row ${index + 2} (${rowLabel(row, index)}) duplicates ${field}=${id} from row ${seen.get(id)}`);
      return;
    }

    seen.set(id, index + 2);
  });
}

function validateReference({
  failures,
  warnings,
  sourceRows,
  sourceFile,
  sourceField,
  targetIds,
  targetFile,
  requireTargetFile = true
}) {
  const referenced = sourceRows
    .map((row, index) => ({ row, index, id: value(row, sourceField) }))
    .filter(({ id }) => Boolean(id));

  if (referenced.length === 0) {
    return;
  }

  if (targetIds === undefined) {
    const message = `${sourceFile}: references ${sourceField}, but ${targetFile} is missing`;
    if (requireTargetFile) {
      failures.push(message);
    } else {
      warnings.push(message);
    }
    return;
  }

  referenced.forEach(({ row, index, id }) => {
    if (!targetIds.has(id)) {
      const message = `${sourceFile}: row ${index + 2} (${rowLabel(row, index)}) references missing ${sourceField}=${id} in ${targetFile}`;
      if (["approved", "approved_with_uncertainty"].includes(value(row, "workflow_status")) || value(row, "review_decision") === "approved") {
        failures.push(message);
      } else {
        warnings.push(message);
      }
    }
  });
}

function validateDelimitedReferences({
  failures,
  warnings,
  sourceRows,
  sourceFile,
  sourceField,
  targetIds,
  targetFile,
  requireTargetFile = true
}) {
  const expandedRows = [];

  sourceRows.forEach((row, index) => {
    value(row, sourceField)
      .split(";")
      .flatMap((part) => part.split(","))
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((id) => expandedRows.push({ ...row, [sourceField]: id, __sourceIndex: String(index) }));
  });

  validateReference({
    failures,
    warnings,
    sourceRows: expandedRows,
    sourceFile,
    sourceField,
    targetIds,
    targetFile,
    requireTargetFile
  });
}

function validateReviewTaskRelatedIds({
  captureIds,
  candidateIds,
  dealIds,
  failures,
  restaurantIds,
  reviewRows,
  sourceIds,
  warnings
}) {
  const targetsByType = new Map([
    ["deal_candidate", { ids: candidateIds, file: "deal-intake.csv", field: "candidate_id" }],
    ["candidate", { ids: candidateIds, file: "deal-intake.csv", field: "candidate_id" }],
    ["deal", { ids: dealIds, file: "deal-intake.csv", field: "deal_id" }],
    ["restaurant", { ids: restaurantIds, file: "restaurant-source-list.csv", field: "restaurant_id" }],
    ["source", { ids: sourceIds, file: "source-inventory.csv", field: "source_id" }],
    ["source_capture", { ids: captureIds, file: "source-captures.csv", field: "source_capture_id" }]
  ]);

  reviewRows.forEach((row, index) => {
    const relatedType = value(row, "related_type");
    const relatedId = value(row, "related_id");

    if (!relatedType && !relatedId) {
      return;
    }

    const target = targetsByType.get(relatedType);
    if (!target) {
      warnings.push(`review-tasks.csv: row ${index + 2} (${rowLabel(row, index)}) has unvalidated related_type=${relatedType || "(blank)"}`);
      return;
    }

    if (!relatedId) {
      warnings.push(`review-tasks.csv: row ${index + 2} (${rowLabel(row, index)}) missing related_id for related_type=${relatedType}`);
      return;
    }

    if (!target.ids.has(relatedId)) {
      const message = `review-tasks.csv: row ${index + 2} (${rowLabel(row, index)}) related_id=${relatedId} is missing from ${target.file} ${target.field}`;
      if (value(row, "decision") === "approved") {
        failures.push(message);
      } else {
        warnings.push(message);
      }
    }
  });
}

export function validateIntakeContract(intakeDir) {
  const failures = [];
  const warnings = [];
  const relativePath = relativeIntakePath(intakeDir);
  const intakeRoot = path.join(repoRoot, "ops/research/intake");
  const realIntakeRoot = fs.realpathSync(intakeRoot);
  const realIntakeDir = fs.realpathSync(intakeDir);
  const areaBrief = readAreaBrief(intakeDir, failures);
  const exampleOnly = isExampleOnly(intakeDir, areaBrief);

  if (!datedIntakePathPattern.test(relativePath) && !exampleOnly) {
    failures.push(`${relativePath}: intake path must be ops/research/intake/<area>-YYYY-MM-DD`);
  }

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    failures.push(`${intakeDir}: intake path must be inside this repository`);
  }

  if (realIntakeDir !== realIntakeRoot && !realIntakeDir.startsWith(`${realIntakeRoot}${path.sep}`)) {
    failures.push(`${intakeDir}: intake path must stay inside ops/research/intake`);
  }

  const files = loadCsvFiles(intakeDir, warnings, failures);
  const missingRequired = requiredIntakeFiles.filter((file) => !fs.existsSync(path.join(intakeDir, file)));
  if (!exampleOnly && missingRequired.length > 0) {
    failures.push(`missing required intake packet file(s): ${missingRequired.join(", ")}`);
  }

  const presentCoreFiles = requiredIntakeFiles.filter((file) => fs.existsSync(path.join(intakeDir, file)));
  const coreRowCount = requiredIntakeFiles
    .filter((file) => file.endsWith(".csv"))
    .reduce((count, file) => count + (files[file]?.rows.length ?? 0), 0);

  if (!exampleOnly && (presentCoreFiles.length === 0 || coreRowCount === 0)) {
    failures.push(`${relativePath}: intake packet has no core CSV data rows`);
  }

  const sourceIds = files["source-inventory.csv"].present ? idsFor(files["source-inventory.csv"].rows, "source_id") : undefined;
  const restaurantIds = files["restaurant-source-list.csv"].present ? idsFor(files["restaurant-source-list.csv"].rows, "restaurant_id") : undefined;
  const captureIds = files["source-captures.csv"].present ? idsFor(files["source-captures.csv"].rows, "source_capture_id") : undefined;
  const candidateIds = files["deal-intake.csv"].present ? idsFor(files["deal-intake.csv"].rows, "candidate_id") : undefined;
  const dealIds = files["deal-intake.csv"].present ? idsFor(files["deal-intake.csv"].rows, "deal_id") : undefined;
  const reviewTaskIds = files["review-tasks.csv"].present ? idsFor(files["review-tasks.csv"].rows, "review_task_id") : undefined;
  const sourceCheckIds = files["source-checks.csv"].present ? idsFor(files["source-checks.csv"].rows, "source_check_id") : undefined;
  const directConfirmationIds = files["direct-confirmations.csv"].present ? idsFor(files["direct-confirmations.csv"].rows, "direct_confirmation_id") : undefined;
  const auditEventIds = files["audit-events.csv"].present ? idsFor(files["audit-events.csv"].rows, "audit_event_id") : undefined;

  validateUniqueIds({ failures, rows: files["restaurant-source-list.csv"].rows, file: "restaurant-source-list.csv", field: "restaurant_id" });
  validateUniqueIds({ failures, rows: files["source-inventory.csv"].rows, file: "source-inventory.csv", field: "source_id" });
  validateUniqueIds({ failures, rows: files["source-captures.csv"].rows, file: "source-captures.csv", field: "source_capture_id" });
  validateUniqueIds({ failures, rows: files["deal-intake.csv"].rows, file: "deal-intake.csv", field: "candidate_id" });
  validateUniqueIds({ failures, rows: files["deal-intake.csv"].rows, file: "deal-intake.csv", field: "deal_id" });
  validateUniqueIds({ failures, rows: files["review-tasks.csv"].rows, file: "review-tasks.csv", field: "review_task_id" });
  validateUniqueIds({ failures, rows: files["source-checks.csv"].rows, file: "source-checks.csv", field: "source_check_id" });
  validateUniqueIds({ failures, rows: files["direct-confirmations.csv"].rows, file: "direct-confirmations.csv", field: "direct_confirmation_id" });
  validateUniqueIds({ failures, rows: files["audit-events.csv"].rows, file: "audit-events.csv", field: "audit_event_id" });

  validateReference({
    failures,
    warnings,
    sourceRows: files["deal-intake.csv"].rows,
    sourceFile: "deal-intake.csv",
    sourceField: "restaurant_id",
    targetIds: restaurantIds,
    targetFile: "restaurant-source-list.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["deal-intake.csv"].rows,
    sourceFile: "deal-intake.csv",
    sourceField: "source_id",
    targetIds: sourceIds,
    targetFile: "source-inventory.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["deal-intake.csv"].rows,
    sourceFile: "deal-intake.csv",
    sourceField: "source_capture_id",
    targetIds: captureIds,
    targetFile: "source-captures.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["deal-intake.csv"].rows,
    sourceFile: "deal-intake.csv",
    sourceField: "review_task_id",
    targetIds: reviewTaskIds,
    targetFile: "review-tasks.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["deal-intake.csv"].rows,
    sourceFile: "deal-intake.csv",
    sourceField: "source_check_id",
    targetIds: sourceCheckIds,
    targetFile: "source-checks.csv",
    requireTargetFile: false
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["deal-intake.csv"].rows,
    sourceFile: "deal-intake.csv",
    sourceField: "direct_confirmation_id",
    targetIds: directConfirmationIds,
    targetFile: "direct-confirmations.csv",
    requireTargetFile: false
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["review-tasks.csv"].rows,
    sourceFile: "review-tasks.csv",
    sourceField: "audit_event_id",
    targetIds: auditEventIds,
    targetFile: "audit-events.csv",
    requireTargetFile: false
  });
  validateReviewTaskRelatedIds({
    captureIds,
    candidateIds,
    dealIds,
    failures,
    restaurantIds,
    reviewRows: files["review-tasks.csv"].rows,
    sourceIds,
    warnings
  });

  validateReference({
    failures,
    warnings,
    sourceRows: files["source-inventory.csv"].rows,
    sourceFile: "source-inventory.csv",
    sourceField: "restaurant_id",
    targetIds: restaurantIds,
    targetFile: "restaurant-source-list.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["source-captures.csv"].rows,
    sourceFile: "source-captures.csv",
    sourceField: "restaurant_id",
    targetIds: restaurantIds,
    targetFile: "restaurant-source-list.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["source-captures.csv"].rows,
    sourceFile: "source-captures.csv",
    sourceField: "source_id",
    targetIds: sourceIds,
    targetFile: "source-inventory.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["review-tasks.csv"].rows,
    sourceFile: "review-tasks.csv",
    sourceField: "restaurant_id",
    targetIds: restaurantIds,
    targetFile: "restaurant-source-list.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["review-tasks.csv"].rows,
    sourceFile: "review-tasks.csv",
    sourceField: "source_id",
    targetIds: sourceIds,
    targetFile: "source-inventory.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["review-tasks.csv"].rows,
    sourceFile: "review-tasks.csv",
    sourceField: "source_capture_id",
    targetIds: captureIds,
    targetFile: "source-captures.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["review-tasks.csv"].rows,
    sourceFile: "review-tasks.csv",
    sourceField: "direct_confirmation_id",
    targetIds: directConfirmationIds,
    targetFile: "direct-confirmations.csv",
    requireTargetFile: false
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["source-checks.csv"].rows,
    sourceFile: "source-checks.csv",
    sourceField: "deal_id",
    targetIds: dealIds,
    targetFile: "deal-intake.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["source-checks.csv"].rows,
    sourceFile: "source-checks.csv",
    sourceField: "restaurant_id",
    targetIds: restaurantIds,
    targetFile: "restaurant-source-list.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["source-checks.csv"].rows,
    sourceFile: "source-checks.csv",
    sourceField: "source_id",
    targetIds: sourceIds,
    targetFile: "source-inventory.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["source-checks.csv"].rows,
    sourceFile: "source-checks.csv",
    sourceField: "direct_confirmation_id",
    targetIds: directConfirmationIds,
    targetFile: "direct-confirmations.csv",
    requireTargetFile: false
  });
  for (const sourceField of ["source_capture_id_before", "source_capture_id_after"]) {
    validateReference({
      failures,
      warnings,
      sourceRows: files["source-checks.csv"].rows,
      sourceFile: "source-checks.csv",
      sourceField,
      targetIds: captureIds,
      targetFile: "source-captures.csv"
    });
  }
  validateDelimitedReferences({
    failures,
    warnings,
    sourceRows: files["source-checks.csv"].rows,
    sourceFile: "source-checks.csv",
    sourceField: "affected_deal_ids",
    targetIds: dealIds,
    targetFile: "deal-intake.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["direct-confirmations.csv"].rows,
    sourceFile: "direct-confirmations.csv",
    sourceField: "deal_id",
    targetIds: dealIds,
    targetFile: "deal-intake.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["direct-confirmations.csv"].rows,
    sourceFile: "direct-confirmations.csv",
    sourceField: "restaurant_id",
    targetIds: restaurantIds,
    targetFile: "restaurant-source-list.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["direct-confirmations.csv"].rows,
    sourceFile: "direct-confirmations.csv",
    sourceField: "source_check_id",
    targetIds: sourceCheckIds,
    targetFile: "source-checks.csv",
    requireTargetFile: false
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["direct-confirmations.csv"].rows,
    sourceFile: "direct-confirmations.csv",
    sourceField: "source_capture_id",
    targetIds: captureIds,
    targetFile: "source-captures.csv"
  });
  validateReference({
    failures,
    warnings,
    sourceRows: files["direct-confirmations.csv"].rows,
    sourceFile: "direct-confirmations.csv",
    sourceField: "review_task_id",
    targetIds: reviewTaskIds,
    targetFile: "review-tasks.csv"
  });

  const auditReferences = [
    ["restaurant_id", restaurantIds, "restaurant-source-list.csv", true],
    ["related_deal_id", dealIds, "deal-intake.csv", true],
    ["related_source_id", sourceIds, "source-inventory.csv", true],
    ["related_source_capture_id", captureIds, "source-captures.csv", true],
    ["related_direct_confirmation_id", directConfirmationIds, "direct-confirmations.csv", false],
    ["related_source_check_id", sourceCheckIds, "source-checks.csv", false],
    ["related_review_task_id", reviewTaskIds, "review-tasks.csv", true]
  ];
  auditReferences.forEach(([sourceField, targetIdsForField, targetFile, requireTargetFile]) => {
    validateReference({
      failures,
      warnings,
      sourceRows: files["audit-events.csv"].rows,
      sourceFile: "audit-events.csv",
      sourceField,
      targetIds: targetIdsForField,
      targetFile,
      requireTargetFile
    });
  });
  files["audit-events.csv"].rows.forEach((row, index) => {
    const entityType = value(row, "entity_type");
    const entityId = value(row, "entity_id");
    const target = new Map([
      ["deal", { ids: dealIds, file: "deal-intake.csv" }],
      ["restaurant", { ids: restaurantIds, file: "restaurant-source-list.csv" }],
      ["source", { ids: sourceIds, file: "source-inventory.csv" }],
      ["source_capture", { ids: captureIds, file: "source-captures.csv" }],
      ["source_check", { ids: sourceCheckIds, file: "source-checks.csv" }],
      ["direct_confirmation", { ids: directConfirmationIds, file: "direct-confirmations.csv" }],
      ["review_task", { ids: reviewTaskIds, file: "review-tasks.csv" }]
    ]).get(entityType);

    if (!entityType || !entityId) {
      return;
    }

    if (!target) {
      warnings.push(`audit-events.csv: row ${index + 2} (${rowLabel(row, index)}) has unvalidated entity_type=${entityType}`);
      return;
    }

    if (!target.ids?.has(entityId)) {
      warnings.push(`audit-events.csv: row ${index + 2} (${rowLabel(row, index)}) entity_id=${entityId} is missing from ${target.file}`);
    }
  });

  return {
    areaBrief,
    exampleOnly,
    failures,
    files,
    presentFileCount: requiredIntakeFiles.filter((file) => fs.existsSync(path.join(intakeDir, file))).length +
      csvIntakeFiles.filter((file) => !requiredIntakeFiles.includes(file) && fs.existsSync(path.join(intakeDir, file))).length,
    relativePath,
    rowCount: Object.values(files).reduce((count, file) => count + file.rows.length, 0),
    warnings
  };
}

export function resolveIntakeDir(intakeArg) {
  return path.resolve(process.cwd(), intakeArg);
}
