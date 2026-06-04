import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getReviewCandidateDetail } from "../../../../../lib/data";

export const dynamic = "force-dynamic";

type CandidateWorksheetPageProps = {
  params: Promise<{
    candidateId: string;
  }>;
};

type SummaryItem = readonly [string, string | undefined];

function splitList(value: string | undefined) {
  return (value ?? "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function readableFlag(value: string) {
  return value.replace(/_/g, " ");
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

export default async function CandidateWorksheetPage({ params }: CandidateWorksheetPageProps) {
  const { candidateId } = await params;
  const candidate = await getReviewCandidateDetail(decodeURIComponent(candidateId));

  if (!candidate) {
    notFound();
  }

  const reviewPacketHref = `/admin/review/${encodeURIComponent(candidate.candidateId)}` as Route;
  const dryRunDiffHref = `/admin/review/${encodeURIComponent(candidate.candidateId)}/dry-run-diff` as Route;
  const riskFlags = splitList(candidate.reviewTask?.riskFlags);
  const uncertaintyFlags = splitList(candidate.uncertaintyFlags);
  const blockers = [
    ...(candidate.promotionBlockers ?? []),
    candidate.publishBlockReason ? `Public block: ${candidate.publishBlockReason}` : undefined,
    candidate.conflictDetected && candidate.conflictDetected !== "false"
      ? `Conflict detected: ${candidate.conflictDetected}`
      : undefined
  ].filter((item): item is string => Boolean(item));
  const fieldsNeeded = candidate.promotionFieldsNeeded ?? [];
  const nextHumanAction = candidate.reviewTask?.nextAction || candidate.reviewReason || "Review source evidence and decide next workflow action.";

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Admin review worksheet</p>
          <h1>{candidate.restaurantName}</h1>
          <p>{candidate.dealTitle}</p>
          <p className="reviewMeta">
            Read-only worksheet / {candidate.status} / {candidate.confidence}
          </p>
        </div>
        <div className="headerActions">
          <Link href={dryRunDiffHref} className="primaryLink">
            Dry-run diff
          </Link>
          <Link href={reviewPacketHref} className="secondaryLink">
            Review packet
          </Link>
          <Link href="/admin/review" className="secondaryLink">
            Review queue
          </Link>
        </div>
      </section>

      <section className="detailGrid reviewPacketGrid" aria-label="Candidate review worksheet">
        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Next human action</p>
          <h2>What needs to happen next</h2>
          <p className="dealTitle">{nextHumanAction}</p>
          <SummaryGrid
            items={[
              ["Review task", candidate.reviewTask?.taskId],
              ["Task status", candidate.reviewTask?.status],
              ["Priority", candidate.reviewTask?.priority],
              ["Action due", candidate.reviewTask?.nextActionDue],
              ["Review reason", candidate.reviewReason],
              ["Decision reason", candidate.decisionReason]
            ]}
          />
          <p className="notes">
            This page does not approve, promote, or write public fixtures.
          </p>
        </article>

        <article className="detailPanel">
          <p className="eyebrow">Blockers</p>
          <h2>Publication blockers</h2>
          <Checklist
            emptyText="No promotion blockers were calculated for this candidate."
            items={blockers}
          />
          {riskFlags.length > 0 ? (
            <>
              <h3>Risk flags</h3>
              <div className="badgeRow">
                {riskFlags.map((flag) => (
                  <span key={flag}>{readableFlag(flag)}</span>
                ))}
              </div>
            </>
          ) : null}
        </article>

        <aside className="detailPanel">
          <p className="eyebrow">Fields needed</p>
          <h2>Missing before promotion</h2>
          <Checklist
            emptyText="No required field gaps were calculated for this candidate."
            items={fieldsNeeded}
          />
          {uncertaintyFlags.length > 0 ? (
            <>
              <h3>Uncertainty flags</h3>
              <div className="badgeRow">
                {uncertaintyFlags.map((flag) => (
                  <span key={flag}>{readableFlag(flag)}</span>
                ))}
              </div>
            </>
          ) : null}
        </aside>

        <article className="detailPanel">
          <p className="eyebrow">Manual mapping</p>
          <h2>Human decisions</h2>
          <Checklist
            emptyText="No manual mapping decisions are currently listed."
            items={candidate.manualMappingDecisions}
          />
        </article>

        <aside className="detailPanel">
          <p className="eyebrow">Copy and gates</p>
          <h2>Public copy status</h2>
          <SummaryGrid
            items={[
              ["Public gate", candidate.publicGateSummary],
              ["MVP eligible", candidate.mvpPublishEligible],
              ["Public copy approved", candidate.publicCopyApproved],
              ["Copy task", candidate.reviewTask?.copyStatus],
              ["Food copy check", candidate.reviewTask?.foodCopyCheck],
              ["Fixture class", candidate.fixtureDataClass],
              ["Live data", candidate.isLiveData],
              ["Prototype notice", candidate.prototypeNotice]
            ]}
          />
        </aside>

        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Evidence status</p>
          <h2>Source and traceability</h2>
          <SummaryGrid
            items={[
              ["Source name", candidate.sourceName],
              ["Source tier", candidate.sourceTier],
              ["Evidence type", candidate.evidenceType],
              ["Captured at", candidate.evidenceCapturedAt],
              ["Last verified", candidate.lastVerified],
              ["Next check due", candidate.nextCheckDue],
              ["Expires on", candidate.expiresOn],
              ["Source capture ID", candidate.sourceCaptureId],
              ["Source check ID", candidate.sourceCheckId],
              ["Direct confirmation ID", candidate.directConfirmationId],
              ["Content hash", candidate.contentHash],
              ["Evidence path", candidate.evidencePath],
              ["Archive path", candidate.archivePath],
              ["Screenshot path", candidate.screenshotPath]
            ]}
          />
          {candidate.evidenceSummary ? <p className="notes">{candidate.evidenceSummary}</p> : null}
          {candidate.sourceQuote ? (
            <blockquote className="reviewQuote">{candidate.sourceQuote}</blockquote>
          ) : (
            <p className="notes">No source quote is captured for this candidate.</p>
          )}
        </article>

        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Candidate fields</p>
          <h2>Read-only deal snapshot</h2>
          <SummaryGrid
            items={[
              ["Candidate ID", candidate.candidateId],
              ["Deal ID", candidate.dealId],
              ["Restaurant ID", candidate.restaurantId],
              ["Source ID", candidate.sourceId],
              ["Origin", candidate.origin],
              ["Intake folder", candidate.intakeFolder],
              ["Area", candidate.areaName],
              ["Day", candidate.dealDay],
              ["Time", candidate.timeWindow],
              ["Price", candidate.price || "See source"],
              ["Category", candidate.category],
              ["Service", candidate.serviceModeSummary],
              ["Location scope", candidate.locationScopeStatus],
              ["Location evidence", candidate.locationEvidence],
              ["Alcohol classification", candidate.alcoholClassification],
              ["Restrictions", candidate.restrictions]
            ]}
          />
          <div className="cardActions">
            <Link href={reviewPacketHref} className="primaryLink">
              Back to review packet
            </Link>
            {candidate.sourceUrl ? (
              <a href={candidate.sourceUrl} className="secondaryLink">
                Open source
              </a>
            ) : (
              <span className="disabledLink">No source on file</span>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
