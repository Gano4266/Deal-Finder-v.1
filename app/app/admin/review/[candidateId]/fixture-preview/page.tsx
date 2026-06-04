import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getReviewCandidateDetail } from "../../../../../lib/data";

export const dynamic = "force-dynamic";

type CandidateFixturePreviewPageProps = {
  params: Promise<{
    candidateId: string;
  }>;
};

type SummaryItem = readonly [string, string | undefined];
type FixturePreview = {
  file: string;
  rowType: string;
  status: string;
  fields: SummaryItem[];
};

const noWriteLanguage =
  "Preview only. This page does not approve rows, promote deals, write fixtures, hydrate public routes, scrape websites, call external APIs, or make AI/agent output evidence.";
const prototypeFixtureDataClass = "verified_static";
const prototypeLiveDataFlag = "false";
const prototypeNotice =
  "Static prototype data. Deal availability is not live and must be confirmed against the listed evidence date.";

function suggested(value: string | undefined, suggestedValue: string) {
  return value || suggestedValue;
}

function SummaryGrid({ items }: { items: SummaryItem[] }) {
  return (
    <dl className="factGrid">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value || "Missing"}</dd>
        </div>
      ))}
    </dl>
  );
}

function Checklist({ emptyText, items }: { emptyText: string; items: string[] }) {
  if (items.length === 0) {
    return <p className="notes">{emptyText}</p>;
  }

  return (
    <ul className="checkList">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function CandidateFixturePreviewPage({ params }: CandidateFixturePreviewPageProps) {
  const { candidateId } = await params;
  const candidate = await getReviewCandidateDetail(decodeURIComponent(candidateId));

  if (!candidate) {
    notFound();
  }

  const packetHref = `/admin/review/${encodeURIComponent(candidate.candidateId)}` as Route;
  const worksheetHref = `/admin/review/${encodeURIComponent(candidate.candidateId)}/worksheet` as Route;
  const dryRunHref = `/admin/review/${encodeURIComponent(candidate.candidateId)}/dry-run-diff` as Route;
  const blockers = [
    ...(candidate.promotionBlockers ?? []),
    candidate.publishBlockReason ? `Public block: ${candidate.publishBlockReason}` : undefined
  ].filter((item): item is string => Boolean(item));
  const fieldsNeeded = candidate.promotionFieldsNeeded ?? [];
  const isBlocked = blockers.length > 0 || fieldsNeeded.length > 0;
  const metadataFields = new Set(["fixture_data_class", "is_live_data", "prototype_notice"]);
  const metadataOnly = fieldsNeeded.length > 0 && fieldsNeeded.every((field) => metadataFields.has(field));
  const previewStatus = isBlocked
    ? "Blocked preview: fixture rows are incomplete until review gaps are resolved."
    : "Preview only: ready for separate human promotion review.";
  const staticFixtureClass = suggested(candidate.fixtureDataClass, prototypeFixtureDataClass);
  const staticLiveFlag = suggested(candidate.isLiveData, prototypeLiveDataFlag);
  const staticPrototypeNotice = suggested(candidate.prototypeNotice, prototypeNotice);
  const reviewedAt = candidate.reviewedAt || "Set only during separate human-reviewed promotion task";
  const reviewedBy = candidate.reviewedBy || "Set only during separate human-reviewed promotion task";
  const metadataPatchItems: SummaryItem[] = [
    ["fixture_data_class", staticFixtureClass],
    ["is_live_data", staticLiveFlag],
    ["prototype_notice", staticPrototypeNotice],
    ["patch status", metadataOnly ? "Only public fixture metadata is missing for this candidate." : "Other review/evidence fields are still blocking promotion."],
    ["write status", "Read-only preview; no fixtures are changed here."]
  ];

  const previews: FixturePreview[] = [
    {
      file: "fixtures/prototype/deals.csv",
      rowType: "public deal row",
      status: isBlocked ? "blocked until field gaps are resolved" : "would require reviewed manual add/update",
      fields: [
        ["deal_id", candidate.dealId],
        ["candidate_id", candidate.candidateId],
        ["restaurant_id", candidate.restaurantId],
        ["restaurant_name", candidate.restaurantName],
        ["deal_title", candidate.dealTitle],
        ["deal_description", candidate.dealDescription],
        ["public_title", candidate.publicTitle],
        ["public_description", candidate.publicDescription],
        ["deal_type", candidate.category],
        ["alcohol_classification", candidate.alcoholClassification],
        ["days_available", candidate.dealDay],
        ["time_window", candidate.timeWindow],
        ["price", candidate.price],
        ["source_id", candidate.sourceId],
        ["source_capture_id", candidate.sourceCaptureId],
        ["source_check_id", candidate.sourceCheckId],
        ["direct_confirmation_id", candidate.directConfirmationId],
        ["source_tier", candidate.sourceTier],
        ["source_url", candidate.sourceUrl],
        ["source_name", candidate.sourceName],
        ["evidence_type", candidate.evidenceType],
        ["evidence_captured_at", candidate.evidenceCapturedAt],
        ["evidence_url_or_path", candidate.evidencePath],
        ["archive_url_or_path", candidate.archivePath],
        ["screenshot_path", candidate.screenshotPath],
        ["source_quote", candidate.sourceQuote],
        ["evidence_summary", candidate.evidenceSummary],
        ["content_hash", candidate.contentHash],
        ["last_verified_at", candidate.lastVerified],
        ["expires_on", candidate.expiresOn],
        ["next_check_due", candidate.nextCheckDue],
        ["confidence_status", candidate.confidence],
        ["workflow_status", candidate.status],
        ["mvp_publish_eligible", candidate.mvpPublishEligible],
        ["publish_block_reason", candidate.publishBlockReason],
        ["location_scope_status", candidate.locationScopeStatus],
        ["location_evidence", candidate.locationEvidence],
        ["review_task_id", candidate.reviewTask?.taskId],
        ["review_reason", candidate.reviewReason],
        ["review_decision", candidate.reviewDecision],
        ["decision_reason", candidate.decisionReason],
        ["reviewed_by", reviewedBy],
        ["reviewed_at", reviewedAt],
        ["public_copy_approved", candidate.publicCopyApproved],
        ["restriction_notes", candidate.restrictions],
        ["uncertainty_flags", candidate.uncertaintyFlags],
        ["conflict_detected", candidate.conflictDetected],
        ["validation_notes", candidate.validationNotes],
        ["fixture_data_class", staticFixtureClass],
        ["is_live_data", staticLiveFlag],
        ["prototype_notice", staticPrototypeNotice]
      ]
    },
    {
      file: "fixtures/prototype/restaurants.csv",
      rowType: "restaurant row",
      status: candidate.restaurantId ? "confirm existing row or add reviewed mapping" : "blocked until restaurant_id is assigned",
      fields: [
        ["restaurant_id", candidate.restaurantId],
        ["name", candidate.restaurantName],
        ["city", candidate.areaName],
        ["state", "NC"],
        ["status", "Required before promotion: active or review-approved fixture status"],
        ["last_checked", candidate.lastVerified],
        ["notes", `Research intake from ${candidate.intakeFolder || "unknown intake"}; not public until reviewed fixtures are promoted.`],
        ["fixture_data_class", staticFixtureClass],
        ["is_live_data", staticLiveFlag],
        ["prototype_notice", staticPrototypeNotice]
      ]
    },
    {
      file: "fixtures/prototype/sources.csv",
      rowType: "source metadata row",
      status: candidate.sourceId ? "confirm existing row or add reviewed source row" : "blocked until source_id is assigned",
      fields: [
        ["source_id", candidate.sourceId],
        ["restaurant_id", candidate.restaurantId],
        ["source_type", candidate.evidenceType],
        ["source_tier", candidate.sourceTier],
        ["source_owner", candidate.sourceName],
        ["source_url", candidate.sourceUrl],
        ["collection_method", "Required before promotion: manual reviewed capture"],
        ["requires_manual_check", "Required before promotion: true/false"],
        ["source_status", "Required before promotion: active/reviewed"],
        ["next_check_due", candidate.nextCheckDue],
        ["evidence_storage_path", candidate.evidencePath],
        ["notes", candidate.evidenceSummary],
        ["fixture_data_class", staticFixtureClass],
        ["is_live_data", staticLiveFlag],
        ["prototype_notice", staticPrototypeNotice]
      ]
    },
    {
      file: "fixtures/prototype/source-captures.csv",
      rowType: "durable evidence capture row",
      status: candidate.sourceCaptureId ? "confirm existing capture or add reviewed capture row" : "blocked until source_capture_id is assigned",
      fields: [
        ["source_capture_id", candidate.sourceCaptureId],
        ["source_id", candidate.sourceId],
        ["restaurant_id", candidate.restaurantId],
        ["captured_at", candidate.evidenceCapturedAt],
        ["captured_by", "Required before promotion: reviewer or capture operator"],
        ["capture_method", candidate.evidenceType],
        ["source_url", candidate.sourceUrl],
        ["evidence_type", candidate.evidenceType],
        ["extracted_text_or_confirmation_note", candidate.sourceQuote],
        ["content_hash", candidate.contentHash],
        ["screenshot_path", candidate.screenshotPath],
        ["archive_url_or_path", candidate.archivePath],
        ["capture_status", "Required before promotion: reviewed"],
        ["notes", candidate.evidenceSummary],
        ["fixture_data_class", staticFixtureClass],
        ["is_live_data", staticLiveFlag],
        ["prototype_notice", staticPrototypeNotice]
      ]
    },
    {
      file: "fixtures/prototype/source-checks.csv",
      rowType: "source freshness/check row",
      status: candidate.sourceCheckId ? "confirm existing check or add reviewed check row" : "blocked until source_check_id is assigned",
      fields: [
        ["source_check_id", candidate.sourceCheckId],
        ["deal_id", candidate.dealId],
        ["restaurant_id", candidate.restaurantId],
        ["source_id", candidate.sourceId],
        ["direct_confirmation_id", candidate.directConfirmationId],
        ["source_capture_id_after", candidate.sourceCaptureId],
        ["checked_at", candidate.lastVerified],
        ["checked_by", reviewedBy],
        ["check_type", "Required before promotion: source_review/direct_confirmation"],
        ["source_tier", candidate.sourceTier],
        ["source_url", candidate.sourceUrl],
        ["result", "Required before promotion: active/verified"],
        ["confidence_status_after", candidate.confidence],
        ["workflow_status_after", candidate.status],
        ["evidence_url_or_path", candidate.evidencePath],
        ["archive_url_or_path", candidate.archivePath],
        ["screenshot_path", candidate.screenshotPath],
        ["content_hash", candidate.contentHash],
        ["next_check_due", candidate.nextCheckDue],
        ["fixture_data_class", staticFixtureClass],
        ["is_live_data", staticLiveFlag],
        ["prototype_notice", staticPrototypeNotice]
      ]
    },
    {
      file: "fixtures/prototype/direct-confirmations.csv",
      rowType: "direct confirmation row",
      status: candidate.directConfirmationId ? "confirm existing direct confirmation or add reviewed row" : "optional unless direct confirmation is the evidence path",
      fields: [
        ["direct_confirmation_id", candidate.directConfirmationId],
        ["restaurant_id", candidate.restaurantId],
        ["deal_id", candidate.dealId],
        ["source_check_id", candidate.sourceCheckId],
        ["source_capture_id", candidate.sourceCaptureId],
        ["confirmed_at", candidate.lastVerified],
        ["confirmed_by", reviewedBy],
        ["contact_method", "Required only for direct confirmation evidence"],
        ["confirmation_summary", candidate.evidenceSummary],
        ["confirmed_fields", "Required only for direct confirmation evidence"],
        ["expires_on", candidate.expiresOn],
        ["next_check_due", candidate.nextCheckDue],
        ["review_task_id", candidate.reviewTask?.taskId],
        ["notes", candidate.validationNotes],
        ["fixture_data_class", staticFixtureClass],
        ["is_live_data", staticLiveFlag],
        ["prototype_notice", staticPrototypeNotice]
      ]
    },
    {
      file: "fixtures/prototype/review-tasks.csv",
      rowType: "review resolution row",
      status: candidate.reviewTask?.taskId ? "confirm existing task or add reviewed resolution" : "blocked until review_task_id is assigned",
      fields: [
        ["review_task_id", candidate.reviewTask?.taskId],
        ["related_type", "deal_candidate"],
        ["related_id", candidate.candidateId],
        ["deal_id", candidate.dealId],
        ["source_id", candidate.sourceId],
        ["restaurant_id", candidate.restaurantId],
        ["source_capture_id", candidate.sourceCaptureId],
        ["direct_confirmation_id", candidate.directConfirmationId],
        ["assigned_reviewer", "Required before promotion"],
        ["review_reason", candidate.reviewReason],
        ["risk_flags", candidate.reviewTask?.riskFlags],
        ["priority", candidate.reviewTask?.priority],
        ["status", candidate.reviewTask?.status],
        ["decision", candidate.reviewDecision],
        ["decision_reason", candidate.decisionReason],
        ["decided_at", candidate.reviewedAt],
        ["decided_by", candidate.reviewedBy],
        ["next_action", candidate.reviewTask?.nextAction],
        ["next_action_due", candidate.reviewTask?.nextActionDue],
        ["fixture_data_class", staticFixtureClass],
        ["is_live_data", staticLiveFlag],
        ["prototype_notice", staticPrototypeNotice]
      ]
    },
    {
      file: "fixtures/prototype/audit-events.csv",
      rowType: "promotion audit event row",
      status: "blocked until a separate reviewed promotion task exists",
      fields: [
        ["audit_event_id", "Generated during separate human-reviewed promotion task"],
        ["event_at", "Set during separate human-reviewed promotion task"],
        ["actor", reviewedBy],
        ["event_type", "research_intake_promotion"],
        ["entity_type", "deal"],
        ["entity_id", candidate.dealId],
        ["restaurant_id", candidate.restaurantId],
        ["related_deal_id", candidate.dealId],
        ["related_source_id", candidate.sourceId],
        ["related_source_capture_id", candidate.sourceCaptureId],
        ["related_direct_confirmation_id", candidate.directConfirmationId],
        ["related_source_check_id", candidate.sourceCheckId],
        ["related_review_task_id", candidate.reviewTask?.taskId],
        ["summary", `Reviewed promotion preview for ${candidate.restaurantName}: ${candidate.dealTitle}`],
        ["evidence_ref", candidate.evidencePath],
        ["notes", "Preview only; not written by this page."],
        ["fixture_data_class", staticFixtureClass],
        ["is_live_data", staticLiveFlag],
        ["prototype_notice", staticPrototypeNotice]
      ]
    },
    {
      file: "fixtures/prototype/fixture-manifest.json",
      rowType: "manifest count/update",
      status: "blocked until all fixture rows are manually reviewed and written",
      fields: [
        ["current_seed_counts.deals", "Increment only after reviewed deal fixture write"],
        ["current_seed_counts.restaurants", "Update only if a new reviewed restaurant row is added"],
        ["current_seed_counts.sources", "Update only if a new reviewed source row is added"],
        ["current_seed_counts.source_captures", "Update only if a new reviewed capture row is added"],
        ["current_seed_counts.source_checks", "Update only if a new reviewed source check row is added"],
        ["current_seed_counts.review_tasks", "Update only if a reviewed task row is added"],
        ["current_seed_counts.audit_events", "Update only after promotion audit event write"],
        ["fixture_generated_at", "Set only during separate reviewed fixture update"]
      ]
    }
  ];

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Admin fixture preview</p>
          <h1>{candidate.restaurantName}</h1>
          <p>{candidate.dealTitle}</p>
          <p className="reviewMeta">{previewStatus}</p>
        </div>
        <div className="headerActions">
          <Link href={dryRunHref} className="secondaryLink">
            Dry-run diff
          </Link>
          <Link href={worksheetHref} className="secondaryLink">
            Worksheet
          </Link>
          <Link href={packetHref} className="secondaryLink">
            Review packet
          </Link>
        </div>
      </section>

      <section className="detailGrid reviewPacketGrid" aria-label="Candidate fixture preview">
        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Read-only fixture shape</p>
          <h2>Future promotion packet</h2>
          <p className="dealTitle">{previewStatus}</p>
          <p className="notes">{noWriteLanguage}</p>
          <div className="reviewStrip">
            <span>Gate: {candidate.publicGateSummary ?? "Not calculated"}</span>
            <span>Metadata-only: {metadataOnly ? "yes" : "no"}</span>
            <span>Fields needed: {fieldsNeeded.length}</span>
            <span>Blockers: {blockers.length}</span>
            <span>Public copy: {candidate.publicCopyApproved || "missing"}</span>
            <span>Review decision: {candidate.reviewDecision || "missing"}</span>
          </div>
        </article>

        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Read-only metadata patch</p>
          <h2>Prototype fixture fields</h2>
          <p className="notes">
            These are the exact static-prototype metadata values a separate reviewed promotion task would need before public fixture validation can pass.
          </p>
          <SummaryGrid items={metadataPatchItems} />
        </article>

        <article className="detailPanel">
          <p className="eyebrow">Still blocked by</p>
          <h2>Field gaps</h2>
          <Checklist
            emptyText="No required field gaps were calculated for this candidate."
            items={fieldsNeeded}
          />
        </article>

        <aside className="detailPanel">
          <p className="eyebrow">Still blocked by</p>
          <h2>Promotion blockers</h2>
          <Checklist
            emptyText="No promotion blockers were calculated for this candidate."
            items={blockers}
          />
        </aside>

        {previews.map((preview) => (
          <article key={preview.file} className="detailPanel fullSpanPanel">
            <p className="eyebrow">{preview.status}</p>
            <h2>{preview.file}</h2>
            <p className="reviewMeta">{preview.rowType}</p>
            <SummaryGrid items={preview.fields} />
          </article>
        ))}

        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Validation</p>
          <h2>Required before any future write</h2>
          <Checklist
            emptyText="No validation commands listed."
            items={[
              "npm run research:validate -- ops/research/intake/<area>-YYYY-MM-DD",
              "node scripts/dry-run-promote-research-intake.mjs ops/research/intake/<area>-YYYY-MM-DD",
              "cd app && npm run validate:data",
              "cd app && npm run lint",
              "cd app && npm run build"
            ]}
          />
          <div className="cardActions">
            <Link href={dryRunHref} className="primaryLink">
              Back to dry-run diff
            </Link>
            <Link href={worksheetHref} className="secondaryLink">
              Back to worksheet
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
