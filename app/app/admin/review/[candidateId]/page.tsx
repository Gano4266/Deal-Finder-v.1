import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getReviewCandidateDetail } from "../../../../lib/data";

export const dynamic = "force-dynamic";

type CandidateDetailPageProps = {
  params: Promise<{
    candidateId: string;
  }>;
};

function splitList(value: string | undefined) {
  return (value ?? "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function FieldList({ fields }: { fields: Array<[string, string | undefined]> }) {
  return (
    <dl className="factGrid">
      {fields.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value || "Missing"}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const { candidateId } = await params;
  const candidate = await getReviewCandidateDetail(decodeURIComponent(candidateId));

  if (!candidate) {
    notFound();
  }

  const riskFlags = splitList(candidate.reviewTask?.riskFlags);
  const uncertaintyFlags = splitList(candidate.uncertaintyFlags);
  const allFlags = Array.from(new Set([...riskFlags, ...uncertaintyFlags]));
  const blockers = candidate.promotionBlockers ?? [];
  const fieldsNeeded = candidate.promotionFieldsNeeded ?? [];
  const worksheetHref = `/admin/review/${encodeURIComponent(candidate.candidateId)}/worksheet` as Route;

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Admin review packet</p>
          <h1>{candidate.restaurantName}</h1>
          <p>{candidate.dealTitle}</p>
          <p className="reviewMeta">
            {candidate.origin === "research_intake" ? "Research intake" : "Seed backlog"} / {candidate.status} / {candidate.confidence}
          </p>
        </div>
        <div className="headerActions">
          <Link href={worksheetHref} className="primaryLink">
            Promotion worksheet
          </Link>
          <Link href="/admin/review" className="secondaryLink">
            Review queue
          </Link>
          {candidate.sourceUrl ? (
            <a href={candidate.sourceUrl} className="secondaryLink">
              Open source
            </a>
          ) : null}
        </div>
      </section>

      <section className="detailGrid reviewPacketGrid" aria-label="Candidate review packet">
        <article className="detailPanel">
          <p className="eyebrow">Candidate</p>
          <h2>Deal details</h2>
          <p className="dealTitle">{candidate.dealDescription || candidate.notes || "Review the source before public use."}</p>
          <FieldList
            fields={[
              ["Candidate ID", candidate.candidateId],
              ["Deal ID", candidate.dealId],
              ["Restaurant ID", candidate.restaurantId],
              ["Source ID", candidate.sourceId],
              ["Day", candidate.dealDay],
              ["Time", candidate.timeWindow],
              ["Price", candidate.price || "See source"],
              ["Category", candidate.category],
              ["Service", candidate.serviceModeSummary],
              ["Freshness", candidate.expiresOn ? `Expires ${candidate.expiresOn}` : candidate.nextCheckDue ? `Check ${candidate.nextCheckDue}` : undefined]
            ]}
          />
        </article>

        <aside className="detailPanel">
          <p className="eyebrow">Operator state</p>
          <h2>Review task</h2>
          <FieldList
            fields={[
              ["Task ID", candidate.reviewTask?.taskId],
              ["Priority", candidate.reviewTask?.priority],
              ["Task status", candidate.reviewTask?.status],
              ["Action due", candidate.reviewTask?.nextActionDue],
              ["Copy status", candidate.reviewTask?.copyStatus],
              ["Food copy check", candidate.reviewTask?.foodCopyCheck],
              ["Review decision", candidate.reviewDecision],
              ["Reviewed by", candidate.reviewedBy],
              ["Reviewed at", candidate.reviewedAt]
            ]}
          />
        </aside>

        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Evidence</p>
          <h2>Source proof</h2>
          <FieldList
            fields={[
              ["Source name", candidate.sourceName],
              ["Source tier", candidate.sourceTier],
              ["Evidence type", candidate.evidenceType],
              ["Captured at", candidate.evidenceCapturedAt],
              ["Last verified", candidate.lastVerified],
              ["Capture ID", candidate.sourceCaptureId],
              ["Source check ID", candidate.sourceCheckId],
              ["Direct confirmation ID", candidate.directConfirmationId],
              ["Content hash", candidate.contentHash],
              ["Evidence path", candidate.evidencePath],
              ["Screenshot path", candidate.screenshotPath],
              ["Archive path", candidate.archivePath]
            ]}
          />
          {candidate.sourceQuote ? (
            <blockquote className="reviewQuote">{candidate.sourceQuote}</blockquote>
          ) : (
            <p className="notes">No source quote is captured for this row yet.</p>
          )}
          {candidate.evidenceSummary ? <p className="notes">{candidate.evidenceSummary}</p> : null}
        </article>

        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Promotion guard</p>
          <h2>Why this is not public yet</h2>
          <p className="reviewMeta">
            This page is read-only. It mirrors the dry-run checklist and does not approve, publish, or write fixtures.
          </p>
          <div className="reviewStrip">
            <span>Gate: {candidate.publicGateSummary ?? "Not calculated"}</span>
            <span>MVP eligible: {candidate.mvpPublishEligible || "missing"}</span>
            <span>Public copy: {candidate.publicCopyApproved || "missing"}</span>
            <span>Conflict: {candidate.conflictDetected || "missing"}</span>
            <span>Fixture class: {candidate.fixtureDataClass || "missing"}</span>
            <span>Live data: {candidate.isLiveData || "missing"}</span>
          </div>

          {blockers.length > 0 ? (
            <ul className="checkList blockerList">
              {blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          ) : (
            <p className="notes">No dry-run blockers were calculated for this row.</p>
          )}

          {fieldsNeeded.length > 0 ? (
            <>
              <h3>Fields needed before manual promotion</h3>
              <div className="badgeRow">
                {fieldsNeeded.map((field) => (
                  <span key={field}>{field}</span>
                ))}
              </div>
            </>
          ) : null}
        </article>

        <article className="detailPanel">
          <p className="eyebrow">Review notes</p>
          <h2>Blockers and context</h2>
          {candidate.reviewTask?.nextAction ? <p><strong>Next action:</strong> {candidate.reviewTask.nextAction}</p> : null}
          {candidate.reviewReason ? <p><strong>Review reason:</strong> {candidate.reviewReason}</p> : null}
          {candidate.publishBlockReason ? <p><strong>Public block:</strong> {candidate.publishBlockReason}</p> : null}
          {candidate.locationScopeStatus ? <p><strong>Scope:</strong> {candidate.locationScopeStatus}</p> : null}
          {candidate.locationEvidence ? <p><strong>Location evidence:</strong> {candidate.locationEvidence}</p> : null}
          {candidate.validationNotes ? <p><strong>Validation notes:</strong> {candidate.validationNotes}</p> : null}
          {candidate.decisionReason ? <p><strong>Decision reason:</strong> {candidate.decisionReason}</p> : null}
        </article>

        <aside className="detailPanel">
          <p className="eyebrow">Flags</p>
          <h2>Risk review</h2>
          <div className="badgeRow">
            {allFlags.length > 0 ? (
              allFlags.map((flag) => (
                <span key={flag}>{flag.replace(/_/g, " ")}</span>
              ))
            ) : (
              <span>No risk flags captured</span>
            )}
          </div>
          <h3>Manual mapping still required</h3>
          <ul className="checkList">
            {candidate.manualMappingDecisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
        </aside>

        <article className="detailPanel fullSpanPanel">
          <p className="eyebrow">Public copy draft</p>
          <h2>Not approved for publication</h2>
          <FieldList
            fields={[
              ["Public title", candidate.publicTitle],
              ["Public description", candidate.publicDescription],
              ["Restriction notes", candidate.restrictions],
              ["Alcohol classification", candidate.alcoholClassification],
              ["Prototype notice", candidate.prototypeNotice]
            ]}
          />
        </article>
      </section>
    </main>
  );
}
