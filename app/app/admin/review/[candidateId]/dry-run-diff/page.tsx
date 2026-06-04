import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getReviewCandidateDetail } from "../../../../../lib/data";

export const dynamic = "force-dynamic";

type CandidateDryRunDiffPageProps = {
  params: Promise<{
    candidateId: string;
  }>;
};

type SummaryItem = readonly [string, string | undefined];

const destinationFixtureFiles = [
  "fixtures/prototype/deals.csv",
  "fixtures/prototype/restaurants.csv",
  "fixtures/prototype/sources.csv",
  "fixtures/prototype/source-captures.csv",
  "fixtures/prototype/source-checks.csv",
  "fixtures/prototype/direct-confirmations.csv",
  "fixtures/prototype/review-tasks.csv",
  "fixtures/prototype/audit-events.csv",
  "fixtures/prototype/fixture-manifest.json"
];

const noWriteLanguage =
  "Dry run only. This page does not approve rows, promote deals, write fixtures, hydrate public routes, scrape websites, call external APIs, or make AI/agent output evidence. There is no write mode and no --write option. Any future fixture change must happen in a separate human-reviewed manual promotion task.";

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

export default async function CandidateDryRunDiffPage({ params }: CandidateDryRunDiffPageProps) {
  const { candidateId } = await params;
  const candidate = await getReviewCandidateDetail(decodeURIComponent(candidateId));

  if (!candidate) {
    notFound();
  }

  const reviewPacketHref = `/admin/review/${encodeURIComponent(candidate.candidateId)}` as Route;
  const worksheetHref = `/admin/review/${encodeURIComponent(candidate.candidateId)}/worksheet` as Route;
  const fixturePreviewHref = `/admin/review/${encodeURIComponent(candidate.candidateId)}/fixture-preview` as Route;
  const fieldsNeeded = candidate.promotionFieldsNeeded ?? [];
  const blockers = [
    ...(candidate.promotionBlockers ?? []),
    candidate.publishBlockReason ? `Public block: ${candidate.publishBlockReason}` : undefined,
    candidate.conflictDetected && candidate.conflictDetected !== "false"
      ? `Conflict detected: ${candidate.conflictDetected}`
      : undefined
  ].filter((item): item is string => Boolean(item));
  const dryRunStatus =
    blockers.length > 0 || fieldsNeeded.length > 0
      ? "Blocked until field gaps and review decisions are resolved."
      : "No calculated gaps: still dry-run only until a reviewer performs a separate approved manual promotion.";

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Admin dry-run diff</p>
          <h1>{candidate.restaurantName}</h1>
          <p>{candidate.dealTitle}</p>
          <p className="reviewMeta">
            {dryRunStatus}
          </p>
        </div>
        <div className="headerActions">
          <Link href={fixturePreviewHref} className="primaryLink">
            Fixture preview
          </Link>
          <Link href={worksheetHref} className="secondaryLink">
            Worksheet
          </Link>
          <Link href={reviewPacketHref} className="secondaryLink">
            Review packet
          </Link>
          <Link href="/admin/review" className="secondaryLink">
            Review queue
          </Link>
        </div>
      </section>

      <section className="detailGrid reviewPacketGrid" aria-label="Candidate dry-run promotion diff">
        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">No-write dry run</p>
          <h2>Status and guardrails</h2>
          <p className="dealTitle">{dryRunStatus}</p>
          <p className="notes">
            {noWriteLanguage}
          </p>
          <div className="reviewStrip">
            <span>Gate: {candidate.publicGateSummary ?? "Not calculated"}</span>
            <span>Workflow: {candidate.status || "missing"}</span>
            <span>Confidence: {candidate.confidence || "missing"}</span>
            <span>MVP eligible: {candidate.mvpPublishEligible || "missing"}</span>
            <span>Public copy: {candidate.publicCopyApproved || "missing"}</span>
            <span>Review decision: {candidate.reviewDecision || "missing"}</span>
          </div>
        </article>

        <article className="detailPanel">
          <p className="eyebrow">Candidate identity</p>
          <h2>Source row</h2>
          <SummaryGrid
            items={[
              ["Candidate ID", candidate.candidateId],
              ["Deal ID", candidate.dealId],
              ["Restaurant", candidate.restaurantName],
              ["Restaurant ID", candidate.restaurantId],
              ["Origin", candidate.origin],
              ["Intake folder", candidate.intakeFolder],
              ["Area", candidate.areaName]
            ]}
          />
        </article>

        <aside className="detailPanel">
          <p className="eyebrow">Fields still needed</p>
          <h2>Before any promotion</h2>
          <Checklist
            emptyText="No required field gaps were calculated for this candidate."
            items={fieldsNeeded}
          />
        </aside>

        <article className="detailPanel">
          <p className="eyebrow">Blockers</p>
          <h2>Publication blockers</h2>
          <Checklist
            emptyText="No dry-run blockers were calculated for this candidate."
            items={blockers}
          />
        </article>

        <aside className="detailPanel">
          <p className="eyebrow">Destination fixtures</p>
          <h2>Manual update targets</h2>
          <p className="notes">
            A future reviewed promotion would require coordinated manual edits to public fixture rows; this route only names the files.
          </p>
          <Checklist
            emptyText="No destination fixture files are listed."
            items={destinationFixtureFiles}
          />
        </aside>

        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Row relationships</p>
          <h2>Relationship categories</h2>
          <SummaryGrid
            items={[
              ["Candidate to restaurant", candidate.restaurantId || candidate.restaurantName],
              ["Candidate to source", candidate.sourceId || candidate.sourceName],
              ["Evidence capture", candidate.sourceCaptureId],
              ["Direct confirmation", candidate.directConfirmationId],
              ["Source check", candidate.sourceCheckId],
              ["Review task", candidate.reviewTask?.taskId],
              ["Public deal row", candidate.dealId],
              ["Freshness", candidate.expiresOn ? `Expires ${candidate.expiresOn}` : candidate.nextCheckDue ? `Check ${candidate.nextCheckDue}` : undefined],
              ["Copy gate", candidate.publicCopyApproved],
              ["Scope gate", candidate.locationScopeStatus],
              ["Fixture class", candidate.fixtureDataClass],
              ["Live data flag", candidate.isLiveData]
            ]}
          />
        </article>

        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Manual decisions</p>
          <h2>Still reviewer-owned</h2>
          <Checklist
            emptyText="No manual mapping decisions are currently listed."
            items={candidate.manualMappingDecisions}
          />
          <div className="cardActions">
            <Link href={fixturePreviewHref} className="primaryLink">
              Fixture preview
            </Link>
            <Link href={worksheetHref} className="primaryLink">
              Back to worksheet
            </Link>
            <Link href={reviewPacketHref} className="secondaryLink">
              Back to packet
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
