import fs from "node:fs";
import path from "node:path";
import { validateIntakeContract, readCsv, repoRoot, value } from "./research-intake-contract.mjs";

const prototypeMetadata = {
  fixture_data_class: "verified_static",
  is_live_data: "false",
  prototype_notice: "Static prototype data. Deal availability is not live and must be confirmed against the listed evidence date."
};

const fixtureFiles = {
  deals: "fixtures/prototype/deals.csv",
  restaurants: "fixtures/prototype/restaurants.csv",
  sources: "fixtures/prototype/sources.csv",
  sourceCaptures: "fixtures/prototype/source-captures.csv",
  sourceChecks: "fixtures/prototype/source-checks.csv",
  reviewTasks: "fixtures/prototype/review-tasks.csv",
  auditEvents: "fixtures/prototype/audit-events.csv"
};

const manifestFile = "fixtures/prototype/fixture-manifest.json";

const fixtureManifestCounts = {
  restaurants: "restaurants",
  sources: "sources",
  sourceCaptures: "source_captures",
  sourceChecks: "source_checks",
  deals: "public_deals",
  reviewTasks: "review_tasks",
  auditEvents: "audit_events"
};

const fixtureIdFields = {
  deals: "deal_id",
  restaurants: "restaurant_id",
  sources: "source_id",
  sourceCaptures: "source_capture_id",
  sourceChecks: "source_check_id",
  reviewTasks: "review_task_id",
  auditEvents: "audit_event_id"
};

const requiredNonMetadataFields = [
  "reviewed_by",
  "reviewed_at",
  "deal_id",
  "candidate_id",
  "restaurant_id",
  "source_id",
  "source_capture_id",
  "source_check_id",
  "source_url",
  "public_title",
  "public_description",
  "source_quote",
  "evidence_summary",
  "content_hash",
  "next_check_due",
  "review_task_id",
  "evidence_captured_at",
  "last_verified_at",
  "decision_reason",
  "published_at",
  "dine_in",
  "takeout",
  "delivery"
];

const metadataFields = new Set(Object.keys(prototypeMetadata));
const parityIgnoreFields = new Set([
  ...metadataFields,
  "created_at",
  "updated_at"
]);

function readOptionalCsv(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return { headers: [], rows: [] };
  }

  return readCsv(absolutePath, relativePath);
}

function readOptionalJson(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return undefined;
  }

  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function byId(rows, field) {
  return new Map(rows.filter((row) => value(row, field)).map((row) => [value(row, field), row]));
}

function duplicateIds(rows, field) {
  const seen = new Set();
  const duplicates = new Set();

  rows.forEach((row) => {
    const id = value(row, field);
    if (!id) {
      return;
    }

    if (seen.has(id)) {
      duplicates.add(id);
      return;
    }

    seen.add(id);
  });

  return [...duplicates].sort();
}

function idsForRows(rows, field) {
  return new Set(rows.map((row) => value(row, field)).filter(Boolean));
}

function idList(text) {
  return text
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function auditEventSupportsRow({ auditEvent, dealId, reviewTaskId }) {
  return value(auditEvent, "related_deal_id") === dealId ||
    value(auditEvent, "entity_id") === dealId ||
    value(auditEvent, "related_review_task_id") === reviewTaskId;
}

function sourceCheckSupportsRow({ sourceCheck, dealId }) {
  return value(sourceCheck, "deal_id") === dealId ||
    idList(value(sourceCheck, "affected_deal_ids")).includes(dealId);
}

function addRelationshipDrift(drifts, { type, id, field, actual, expected }) {
  if (!expected || !actual || actual === expected) {
    return;
  }

  drifts.push({
    type,
    id,
    field,
    actual,
    expected,
    issue: `${field} points at ${actual}, expected ${expected}`
  });
}

function metadataDiff(row) {
  return Object.entries(prototypeMetadata)
    .filter(([field, expected]) => value(row, field) !== expected)
    .map(([field, expected]) => ({
      field,
      current: value(row, field),
      expected
    }));
}

function nonMetadataGaps(row) {
  const gaps = requiredNonMetadataFields.filter((field) => !value(row, field));

  if (value(row, "workflow_status") !== "approved" && value(row, "workflow_status") !== "approved_with_uncertainty") {
    gaps.push("workflow_status");
  }

  if (value(row, "confidence_status") !== "verified") {
    gaps.push("confidence_status");
  }

  if (value(row, "review_decision") !== "approved") {
    gaps.push("review_decision");
  }

  if (value(row, "public_copy_approved") !== "true") {
    gaps.push("public_copy_approved");
  }

  if (value(row, "mvp_publish_eligible") !== "true") {
    gaps.push("mvp_publish_eligible");
  }

  if (value(row, "conflict_detected") !== "false") {
    gaps.push("conflict_detected");
  }

  if (value(row, "alcohol_classification") !== "food_only") {
    gaps.push("alcohol_classification");
  }

  return [...new Set(gaps)].sort();
}

function fieldParityDiffs({ intakeRow, publicRow }) {
  if (!publicRow) {
    return [];
  }

  return Object.keys(intakeRow)
    .filter((field) => !parityIgnoreFields.has(field))
    .filter((field) => Object.hasOwn(publicRow, field))
    .filter((field) => value(intakeRow, field) !== value(publicRow, field))
    .map((field) => ({
      field,
      intake: value(intakeRow, field),
      public_fixture: value(publicRow, field)
    }));
}

function manifestParity({ fixtureRows, manifest }) {
  if (!manifest) {
    return {
      present: false,
      counts: [],
      drift: [],
      note: `${manifestFile} not found; run app data validation before any fixture edit.`
    };
  }

  const counts = Object.entries(fixtureManifestCounts).map(([fixtureKey, manifestKey]) => {
    const expected = manifest.current_seed_counts?.[manifestKey];
    const actual = fixtureRows[fixtureKey]?.rows.length ?? 0;

    return {
      key: manifestKey,
      expected,
      actual,
      delta: typeof expected === "number" ? actual - expected : undefined,
      matches: expected === actual
    };
  });
  const metadata = [
    {
      field: "fixture_data_class_default",
      expected: "verified_static",
      actual: manifest.fixture_data_class_default,
      matches: manifest.fixture_data_class_default === "verified_static"
    },
    {
      field: "is_live_data",
      expected: false,
      actual: manifest.is_live_data,
      matches: manifest.is_live_data === false
    },
    {
      field: "prototype_notice",
      expected: "nonempty",
      actual: manifest.prototype_notice,
      matches: typeof manifest.prototype_notice === "string" && manifest.prototype_notice.trim().length > 0
    },
    {
      field: "fixture_generated_at",
      expected: "nonempty",
      actual: manifest.fixture_generated_at,
      matches: typeof manifest.fixture_generated_at === "string" && manifest.fixture_generated_at.trim().length > 0
    },
    {
      field: "fixture_verification_scope",
      expected: "nonempty",
      actual: manifest.fixture_verification_scope,
      matches: typeof manifest.fixture_verification_scope === "string" && manifest.fixture_verification_scope.trim().length > 0
    }
  ];
  const uniqueness = Object.entries(fixtureIdFields).map(([fixtureKey, idField]) => ({
    file: fixtureFiles[fixtureKey],
    idField,
    duplicates: duplicateIds(fixtureRows[fixtureKey]?.rows ?? [], idField)
  }));
  const restaurantIds = idsForRows(fixtureRows.restaurants.rows, "restaurant_id");
  const sourceRestaurantIds = idsForRows(fixtureRows.sources.rows, "restaurant_id");
  const restaurantsWithoutSource = [...restaurantIds].filter((restaurantId) => !sourceRestaurantIds.has(restaurantId)).sort();
  const targetRestaurants = manifest.minimum_seed_targets?.restaurants;
  const targetCaptures = manifest.minimum_seed_targets?.successful_source_captures_or_manual_evidence_notes;
  const targetSourcesPerRestaurant = manifest.minimum_seed_targets?.sources_per_restaurant;
  const averageSourcesPerRestaurant = restaurantIds.size > 0 ?
    Number((fixtureRows.sources.rows.length / restaurantIds.size).toFixed(2)) :
    0;

  return {
    present: true,
    metadata,
    metadataDrift: metadata.filter((item) => !item.matches),
    counts,
    drift: counts.filter((count) => !count.matches),
    idUniqueness: uniqueness,
    duplicateIds: uniqueness.filter((item) => item.duplicates.length > 0),
    sourceCoverage: {
      restaurants: restaurantIds.size,
      sources: fixtureRows.sources.rows.length,
      restaurantsWithSource: sourceRestaurantIds.size,
      restaurantsWithoutSource: restaurantsWithoutSource.length,
      restaurantIdsWithoutSource: restaurantsWithoutSource,
      averageSourcesPerRestaurant
    },
    minimumTargets: {
      restaurants: {
        actual: restaurantIds.size,
        target: targetRestaurants,
        passes: typeof targetRestaurants === "number" ? restaurantIds.size >= targetRestaurants : undefined
      },
      sourceCaptures: {
        actual: fixtureRows.sourceCaptures.rows.length,
        target: targetCaptures,
        passes: typeof targetCaptures === "number" ? fixtureRows.sourceCaptures.rows.length >= targetCaptures : undefined
      },
      sourcesPerRestaurant: {
        actualAverage: averageSourcesPerRestaurant,
        target: targetSourcesPerRestaurant,
        restaurantsWithoutSource: restaurantsWithoutSource.length,
        passesAverage: typeof targetSourcesPerRestaurant === "number" ? averageSourcesPerRestaurant >= targetSourcesPerRestaurant : undefined
      }
    },
    requiredManifestCountUpdates: 0,
    note: "Manifest counts are a read-only snapshot. Final fixture edits still require app data validation."
  };
}

function relationshipStatus({ fixtureIndexes, intakeIndexes, row }) {
  const reviewTaskId = value(row, "review_task_id");
  const dealId = value(row, "deal_id");
  const intakeReviewTask = intakeIndexes.reviewTasks.get(reviewTaskId);
  const publicReviewTask = fixtureIndexes.reviewTasks.get(reviewTaskId);
  const intakeAuditEventId = value(intakeReviewTask ?? {}, "audit_event_id");
  const publicAuditEventId = value(publicReviewTask ?? {}, "audit_event_id");
  const publicAuditEventById = publicAuditEventId ? fixtureIndexes.auditEvents.get(publicAuditEventId) : undefined;
  const publicAuditEventByReverseLink = fixtureIndexes.auditEventsRows.find((auditEvent) =>
    auditEventSupportsRow({ auditEvent, dealId, reviewTaskId })
  );
  const publicAuditEvent = publicAuditEventById ?? publicAuditEventByReverseLink;
  const auditEventId = value(publicAuditEvent ?? {}, "audit_event_id") || publicAuditEventId || intakeAuditEventId;
  const publicSource = fixtureIndexes.sources.get(value(row, "source_id"));
  const publicSourceCapture = fixtureIndexes.sourceCaptures.get(value(row, "source_capture_id"));
  const publicSourceCheck = fixtureIndexes.sourceChecks.get(value(row, "source_check_id"));
  const auditEventIdAliases = [];
  const relationshipDrifts = [];

  if (publicSource) {
    addRelationshipDrift(relationshipDrifts, {
      type: "source",
      id: value(row, "source_id"),
      field: "restaurant_id",
      actual: value(publicSource, "restaurant_id"),
      expected: value(row, "restaurant_id")
    });
  }

  if (publicSourceCapture) {
    [
      ["restaurant_id", value(row, "restaurant_id")],
      ["source_id", value(row, "source_id")]
    ].forEach(([field, expected]) => {
      addRelationshipDrift(relationshipDrifts, {
        type: "source_capture",
        id: value(row, "source_capture_id"),
        field,
        actual: value(publicSourceCapture, field),
        expected
      });
    });
  }

  if (publicSourceCheck && !sourceCheckSupportsRow({ sourceCheck: publicSourceCheck, dealId })) {
    relationshipDrifts.push({
      type: "source_check",
      id: value(row, "source_check_id"),
      issue: "source check exists but does not reference this deal_id or affected_deal_ids"
    });
  }

  if (publicSourceCheck) {
    [
      ["restaurant_id", value(row, "restaurant_id")],
      ["source_id", value(row, "source_id")],
      ["source_capture_id_after", value(row, "source_capture_id")]
    ].forEach(([field, expected]) => {
      addRelationshipDrift(relationshipDrifts, {
        type: "source_check",
        id: value(row, "source_check_id"),
        field,
        actual: value(publicSourceCheck, field),
        expected
      });
    });
  }

  if (publicReviewTask) {
    [
      ["deal_id", dealId],
      ["restaurant_id", value(row, "restaurant_id")],
      ["source_id", value(row, "source_id")],
      ["source_capture_id", value(row, "source_capture_id")]
    ].forEach(([field, expected]) => {
      addRelationshipDrift(relationshipDrifts, {
        type: "review_task",
        id: reviewTaskId,
        field,
        actual: value(publicReviewTask, field),
        expected
      });
    });
  }

  if (publicAuditEvent && !auditEventSupportsRow({ auditEvent: publicAuditEvent, dealId, reviewTaskId })) {
    relationshipDrifts.push({
      type: "audit_event",
      id: value(publicAuditEvent, "audit_event_id"),
      issue: "audit event exists but does not reference this deal_id or review_task_id"
    });
  }

  if (publicAuditEvent) {
    [
      ["restaurant_id", value(row, "restaurant_id")],
      ["related_deal_id", dealId],
      ["related_source_id", value(row, "source_id")],
      ["related_source_capture_id", value(row, "source_capture_id")],
      ["related_source_check_id", value(row, "source_check_id")],
      ["related_review_task_id", reviewTaskId]
    ].forEach(([field, expected]) => {
      addRelationshipDrift(relationshipDrifts, {
        type: "audit_event",
        id: value(publicAuditEvent, "audit_event_id"),
        field,
        actual: value(publicAuditEvent, field),
        expected
      });
    });
  }

  if (intakeAuditEventId && publicAuditEventId && intakeAuditEventId !== publicAuditEventId) {
    auditEventIdAliases.push({
      type: "audit_event_id",
      id: publicAuditEventId,
      intake_id: intakeAuditEventId,
      note: "intake review task and public review task use different audit_event_id values; public audit history resolves"
    });
  }

  const relationships = {
    deal: {
      id: dealId,
      public_fixture_exists: fixtureIndexes.deals.has(dealId)
    },
    restaurant: {
      id: value(row, "restaurant_id"),
      public_fixture_exists: fixtureIndexes.restaurants.has(value(row, "restaurant_id"))
    },
    source: {
      id: value(row, "source_id"),
      public_fixture_exists: fixtureIndexes.sources.has(value(row, "source_id"))
    },
    source_capture: {
      id: value(row, "source_capture_id"),
      public_fixture_exists: fixtureIndexes.sourceCaptures.has(value(row, "source_capture_id"))
    },
    source_check: {
      id: value(row, "source_check_id"),
      public_fixture_exists: Boolean(publicSourceCheck)
    },
    review_task: {
      id: reviewTaskId,
      public_fixture_exists: fixtureIndexes.reviewTasks.has(reviewTaskId)
    },
    audit_event: {
      id: auditEventId,
      public_fixture_exists: Boolean(publicAuditEvent)
    }
  };

  return {
    publicDeal: relationships.deal.public_fixture_exists,
    publicRestaurant: relationships.restaurant.public_fixture_exists,
    publicSource: relationships.source.public_fixture_exists,
    publicSourceCapture: relationships.source_capture.public_fixture_exists,
    publicSourceCheck: relationships.source_check.public_fixture_exists,
    publicReviewTask: relationships.review_task.public_fixture_exists,
    publicAuditEvent: relationships.audit_event.public_fixture_exists,
    auditEventId,
    details: relationships,
    missingPublicRelationships: Object.entries(relationships)
      .filter(([, relationship]) => relationship.id && !relationship.public_fixture_exists)
      .map(([type, relationship]) => ({ type, id: relationship.id })),
    missingRelationshipIds: Object.entries(relationships)
      .filter(([, relationship]) => !relationship.id)
      .map(([type]) => type),
    auditEventIdAliases,
    relationshipDrifts,
    publicReviewTaskAuditEventId: publicAuditEventId,
    publicAuditEventResolvedBy: publicAuditEventById ? "review_task_audit_event_id" : publicAuditEventByReverseLink ? "reverse_link" : "",
    intakeReviewTaskAuditEventId: intakeAuditEventId
  };
}

function linkedPublicRows({ fixtureIndexes, row, relationships }) {
  return {
    deal: {
      id: value(row, "deal_id"),
      row: fixtureIndexes.deals.get(value(row, "deal_id"))
    },
    restaurant: {
      id: value(row, "restaurant_id"),
      row: fixtureIndexes.restaurants.get(value(row, "restaurant_id"))
    },
    source: {
      id: value(row, "source_id"),
      row: fixtureIndexes.sources.get(value(row, "source_id"))
    },
    source_capture: {
      id: value(row, "source_capture_id"),
      row: fixtureIndexes.sourceCaptures.get(value(row, "source_capture_id"))
    },
    source_check: {
      id: value(row, "source_check_id"),
      row: fixtureIndexes.sourceChecks.get(value(row, "source_check_id"))
    },
    review_task: {
      id: value(row, "review_task_id"),
      row: fixtureIndexes.reviewTasks.get(value(row, "review_task_id"))
    },
    audit_event: {
      id: relationships.auditEventId,
      row: relationships.auditEventId ? fixtureIndexes.auditEvents.get(relationships.auditEventId) : undefined
    }
  };
}

function supportMetadataDiffs({ fixtureIndexes, row, relationships }) {
  return Object.entries(linkedPublicRows({ fixtureIndexes, row, relationships }))
    .filter(([type]) => type !== "deal")
    .filter(([, support]) => support.row)
    .map(([type, support]) => ({
      type,
      id: support.id,
      diffs: metadataDiff(support.row)
    }))
    .filter((support) => support.diffs.length > 0);
}

function summarizeRow({ fixtureIndexes, intakeIndexes, row }) {
  const dealId = value(row, "deal_id");
  const publicDeal = fixtureIndexes.deals.get(dealId);
  const intakeMetadataDiff = metadataDiff(row);
  const publicMetadataDiff = publicDeal ? metadataDiff(publicDeal) : [];
  const intakeGaps = nonMetadataGaps(row);
  const publicFixtureGaps = publicDeal ? nonMetadataGaps(publicDeal) : [];
  const relationships = relationshipStatus({ fixtureIndexes, intakeIndexes, row });
  const fieldDiffs = fieldParityDiffs({ intakeRow: row, publicRow: publicDeal });
  const supportMetadata = supportMetadataDiffs({ fixtureIndexes, row, relationships });
  const publicFixtureMetadataMatched = Boolean(publicDeal) && publicMetadataDiff.length === 0;
  const intakeMetadataOnly = intakeGaps.length === 0 && intakeMetadataDiff.length > 0;
  const publicRelationshipsPresent = relationships.missingPublicRelationships.length === 0 &&
    relationships.missingRelationshipIds.length === 0 &&
    relationships.relationshipDrifts.length === 0;

  let recommendedAction = "Resolve intake-side non-metadata review/evidence/copy gaps before using this intake row as a fixture source.";
  if (intakeGaps.length > 0 && publicDeal && publicFixtureGaps.length === 0 && publicFixtureMetadataMatched && publicRelationshipsPresent) {
    recommendedAction = "Public fixture row is complete; reconcile intake-side gaps or drift only if intake remains source of record.";
  } else if (intakeGaps.length === 0 && !publicDeal) {
    recommendedAction = "Public fixture row is missing; prepare a separate human-reviewed manual fixture add.";
  } else if (intakeGaps.length === 0 && !publicRelationshipsPresent) {
    recommendedAction = "Public deal row exists, but fixture support rows or relationship ids need review before expansion.";
  } else if (intakeGaps.length === 0 && publicFixtureMetadataMatched) {
    recommendedAction = "No public fixture metadata write needed; existing public fixture row already has static prototype metadata.";
  } else if (intakeGaps.length === 0) {
    recommendedAction = "Public fixture exists but static prototype metadata differs; review before any manual fixture edit.";
  }

  return {
    deal_id: dealId,
    candidate_id: value(row, "candidate_id"),
    restaurant_id: value(row, "restaurant_id"),
    restaurant_name: value(row, "restaurant_name"),
    deal_title: value(row, "deal_title"),
    intake_metadata_only_blocked: intakeMetadataOnly,
    intake_metadata_diff: intakeMetadataDiff,
    non_metadata_gaps: intakeGaps,
    public_fixture_non_metadata_gaps: publicFixtureGaps,
    public_fixture_exists: Boolean(publicDeal),
    public_fixture_metadata_matched: publicFixtureMetadataMatched,
    public_fixture_metadata_diff: publicMetadataDiff,
    public_support_metadata_diff: supportMetadata,
    public_relationships_present: publicRelationshipsPresent,
    relationships,
    intake_public_field_diffs: fieldDiffs,
    recommended_action: recommendedAction
  };
}

function buildPacket(intakeDir) {
  const contract = validateIntakeContract(intakeDir);
  if (contract.failures.length > 0) {
    return {
      intakeFolder: path.relative(repoRoot, intakeDir),
      dryRunOnly: true,
      contract,
      rows: [],
      error: "Research intake contract has failures. Fix contract failures before promotion packet prep."
    };
  }

  const dealIntake = readCsv(path.join(intakeDir, "deal-intake.csv"), "deal-intake.csv");
  const fixtureRows = {
    deals: readOptionalCsv(fixtureFiles.deals),
    restaurants: readOptionalCsv(fixtureFiles.restaurants),
    sources: readOptionalCsv(fixtureFiles.sources),
    sourceCaptures: readOptionalCsv(fixtureFiles.sourceCaptures),
    sourceChecks: readOptionalCsv(fixtureFiles.sourceChecks),
    reviewTasks: readOptionalCsv(fixtureFiles.reviewTasks),
    auditEvents: readOptionalCsv(fixtureFiles.auditEvents)
  };
  const intakeIndexes = {
    reviewTasks: byId(readOptionalCsv(path.join(path.relative(repoRoot, intakeDir), "review-tasks.csv")).rows, "review_task_id")
  };
  const fixtureIndexes = {
    deals: byId(fixtureRows.deals.rows, "deal_id"),
    restaurants: byId(fixtureRows.restaurants.rows, "restaurant_id"),
    sources: byId(fixtureRows.sources.rows, "source_id"),
    sourceCaptures: byId(fixtureRows.sourceCaptures.rows, "source_capture_id"),
    sourceChecks: byId(fixtureRows.sourceChecks.rows, "source_check_id"),
    reviewTasks: byId(fixtureRows.reviewTasks.rows, "review_task_id"),
    auditEvents: byId(fixtureRows.auditEvents.rows, "audit_event_id"),
    auditEventsRows: fixtureRows.auditEvents.rows
  };
  const manifest = manifestParity({
    fixtureRows,
    manifest: readOptionalJson(manifestFile)
  });
  const approvedRows = dealIntake.rows.filter((row) =>
    ["approved", "approved_with_uncertainty"].includes(value(row, "workflow_status")) &&
    value(row, "review_decision") === "approved"
  );
  const rows = approvedRows.map((row) => summarizeRow({ fixtureIndexes, intakeIndexes, row }));

  return {
    intakeFolder: path.relative(repoRoot, intakeDir),
    dryRunOnly: true,
    note: "Read-only promotion packet. No fixture edits, approvals, scraping, external calls, or public route hydration are performed.",
    contract: {
      failures: contract.failures,
      warnings: contract.warnings
    },
    summary: {
      approvedRowsScanned: rows.length,
      intakeMetadataOnlyBlocked: rows.filter((row) => row.intake_metadata_only_blocked).length,
      publicFixtureRowsMetadataMatched: rows.filter((row) => row.public_fixture_metadata_matched).length,
      publicFixtureRowsMissing: rows.filter((row) => !row.public_fixture_exists).length,
      rowsWithMissingPublicRelationships: rows.filter((row) => !row.public_relationships_present).length,
      rowsWithRelationshipDrift: rows.filter((row) => row.relationships.relationshipDrifts.length > 0).length,
      rowsWithAuditEventIdAliases: rows.filter((row) => row.relationships.auditEventIdAliases.length > 0).length,
      rowsWithIntakePublicFieldDrift: rows.filter((row) => row.intake_public_field_diffs.length > 0).length,
      rowsWithSupportMetadataDrift: rows.filter((row) => row.public_support_metadata_diff.length > 0).length,
      rowsWithPublicFixtureNonMetadataGaps: rows.filter((row) => row.public_fixture_non_metadata_gaps.length > 0).length,
      rowsWithNonMetadataGaps: rows.filter((row) => row.non_metadata_gaps.length > 0).length
    },
    manifest,
    prototypeMetadata,
    rows
  };
}

function printPacket(packet) {
  console.log(`Fixture promotion packet: ${packet.intakeFolder}`);
  console.log("Read-only. No fixture edits, approvals, promotions, scraping, external calls, or public route hydration.");

  if (packet.error) {
    console.log(`\n${packet.error}`);
    packet.contract.failures.forEach((failure) => console.log(`- ${failure}`));
    return;
  }

  console.log("\nSummary");
  Object.entries(packet.summary).forEach(([key, currentValue]) => {
    console.log(`- ${key}: ${currentValue}`);
  });

  if (packet.contract.warnings.length > 0) {
    console.log("\nContract warnings kept as review blockers");
    packet.contract.warnings.forEach((warning) => console.log(`- ${warning}`));
  }

  console.log("\nStatic prototype metadata");
  Object.entries(packet.prototypeMetadata).forEach(([field, expected]) => {
    console.log(`- ${field}: ${expected}`);
  });

  console.log("\nFixture manifest snapshot");
  console.log(`- manifest present: ${packet.manifest.present ? "yes" : "no"}`);
  if (packet.manifest.metadataDrift) {
    console.log(`- static metadata drift: ${packet.manifest.metadataDrift.length}`);
    packet.manifest.metadataDrift.forEach((item) => {
      console.log(`  ${item.field}: manifest=${item.actual ?? "[missing]"}; expected=${item.expected}`);
    });
  }
  console.log(`- count drift: ${packet.manifest.drift.length}`);
  packet.manifest.drift.forEach((count) => {
    console.log(`  ${count.key}: manifest=${count.expected ?? "[missing]"}; actual=${count.actual}; delta=${count.delta ?? "[unknown]"}`);
  });
  if (packet.manifest.duplicateIds) {
    console.log(`- duplicate fixture ids: ${packet.manifest.duplicateIds.length}`);
    packet.manifest.duplicateIds.forEach((item) => {
      console.log(`  ${item.file} ${item.idField}: ${item.duplicates.join(", ")}`);
    });
  }
  if (packet.manifest.sourceCoverage) {
    const coverage = packet.manifest.sourceCoverage;
    console.log(`- source coverage: ${coverage.restaurantsWithSource}/${coverage.restaurants} restaurants with sources; average sources per restaurant: ${coverage.averageSourcesPerRestaurant}`);
    if (coverage.restaurantsWithoutSource > 0) {
      console.log(`  restaurants without sources: ${coverage.restaurantIdsWithoutSource.join(", ")}`);
    }
  }
  if (packet.manifest.minimumTargets) {
    const targets = packet.manifest.minimumTargets;
    console.log(`- minimum targets: restaurants ${targets.restaurants.actual}/${targets.restaurants.target ?? "[missing]"} ${targets.restaurants.passes ? "pass" : "review"}; source captures ${targets.sourceCaptures.actual}/${targets.sourceCaptures.target ?? "[missing]"} ${targets.sourceCaptures.passes ? "pass" : "review"}; sources/restaurant avg ${targets.sourcesPerRestaurant.actualAverage}/${targets.sourcesPerRestaurant.target ?? "[missing]"} ${targets.sourcesPerRestaurant.passesAverage ? "pass" : "review"}`);
  }
  console.log(`- required manifest count updates proposed by this packet: ${packet.manifest.requiredManifestCountUpdates ?? 0}`);
  console.log(`- note: ${packet.manifest.note}`);

  console.log("\nRows");
  packet.rows.forEach((row) => {
    console.log(`- ${row.deal_id}: ${row.recommended_action}`);
    console.log(`  public fixture: ${row.public_fixture_exists ? "exists" : "missing"}; metadata matched: ${row.public_fixture_metadata_matched ? "yes" : "no"}; relationships present: ${row.public_relationships_present ? "yes" : "no"}; support metadata drift: ${row.public_support_metadata_diff.length}; intake gaps: ${row.non_metadata_gaps.length}; public fixture gaps: ${row.public_fixture_non_metadata_gaps.length}; field drift: ${row.intake_public_field_diffs.length}`);
    if (row.non_metadata_gaps.length > 0) {
      console.log(`  intake gaps: ${row.non_metadata_gaps.join(", ")}`);
    }
    if (row.public_fixture_non_metadata_gaps.length > 0) {
      console.log(`  public fixture gaps: ${row.public_fixture_non_metadata_gaps.join(", ")}`);
    }
    if (row.relationships.missingPublicRelationships.length > 0) {
      console.log(`  missing public relationships: ${row.relationships.missingPublicRelationships.map((relationship) => `${relationship.type}=${relationship.id}`).join(", ")}`);
    }
    if (row.relationships.missingRelationshipIds.length > 0) {
      console.log(`  missing relationship ids: ${row.relationships.missingRelationshipIds.join(", ")}`);
    }
    if (row.relationships.relationshipDrifts.length > 0) {
      console.log(`  relationship drift: ${row.relationships.relationshipDrifts.map((drift) => `${drift.type}${drift.id ? `=${drift.id}` : ""} (${drift.issue})`).join("; ")}`);
    }
    if (row.relationships.auditEventIdAliases.length > 0) {
      console.log(`  audit event id aliases: ${row.relationships.auditEventIdAliases.map((alias) => `intake=${alias.intake_id}; public=${alias.id}`).join("; ")}`);
    }
    if (row.public_support_metadata_diff.length > 0) {
      console.log(`  support metadata drift: ${row.public_support_metadata_diff.map((support) => `${support.type}=${support.id}`).join(", ")}`);
    }
    if (row.intake_public_field_diffs.length > 0) {
      console.log(`  intake/public field drift: ${row.intake_public_field_diffs.map((diff) => `${diff.field} (intake=${diff.intake || "[blank]"}; public=${diff.public_fixture || "[blank]"})`).join("; ")}`);
    }
    if (row.intake_metadata_diff.length > 0) {
      console.log(`  intake metadata patch preview: ${row.intake_metadata_diff.map((diff) => `${diff.field}=${diff.expected}`).join("; ")}`);
    }
  });
}

const intakeArg = process.argv[2];
if (!intakeArg) {
  console.error("Usage: node scripts/prepare-fixture-promotion-packet.mjs ops/research/intake/[folder-name] [--json]");
  process.exit(1);
}

if (process.argv.includes("--write")) {
  console.error("--write is not implemented. This promotion packet is read-only.");
  process.exit(1);
}

const intakeDir = path.resolve(process.cwd(), intakeArg);
if (!fs.existsSync(intakeDir) || !fs.statSync(intakeDir).isDirectory()) {
  console.error(`Research intake folder not found: ${intakeArg}`);
  process.exit(1);
}

const packet = buildPacket(intakeDir);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(packet, null, 2));
} else {
  printPacket(packet);
}

if (packet.error) {
  process.exit(1);
}
