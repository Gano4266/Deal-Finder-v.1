import Link from "next/link";
import { getOpenReviewCandidates, getPrototypeStats } from "../../../lib/data";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const [candidates, stats] = await Promise.all([
    getOpenReviewCandidates(),
    getPrototypeStats()
  ]);

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Admin review</p>
          <h1>Review queue</h1>
          <p>
            Needs-review leads and unresolved conflicts stay here until a human
            approves, rejects, or confirms newer evidence.
          </p>
          <p className="reviewMeta">
            {stats.publicDealsPassingFilter} public prototype deals are approved.
          </p>
        </div>
        <div className="headerActions">
          <Link href="/admin" className="secondaryLink">
            Ops dashboard
          </Link>
          <a href="/admin/source-gaps" className="secondaryLink">
            Source gaps
          </a>
          <Link href="/tonight" className="secondaryLink">
            Public feed
          </Link>
        </div>
      </section>

      {candidates.length === 0 ? (
        <section className="emptyState" aria-label="No open reviews">
          <p className="eyebrow">Review queue clear</p>
          <h2>No source-backed candidates need review right now.</h2>
          <p>
            Approved prototype deals remain visible in `/tonight`; new seed
            candidates will appear here when they need human review.
          </p>
          <Link href="/tonight" className="primaryLink">
            View public feed
          </Link>
        </section>
      ) : (
        <section className="candidateList" aria-label="Review candidates">
          {candidates.map((candidate) => (
          <article key={candidate.candidateId} className="candidateCard">
            <div className="candidateMain">
              <p className="eyebrow">{candidate.dealDay} / {candidate.timeWindow}</p>
              <h2>{candidate.restaurantName}</h2>
              <p className="dealTitle">{candidate.dealTitle}</p>
              <p>{candidate.restrictions}</p>
            </div>

            <dl className="factGrid">
              <div>
                <dt>Status</dt>
                <dd>{candidate.status} / {candidate.confidence}</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>{candidate.price || "See source"}</dd>
              </div>
              <div>
                <dt>Last verified</dt>
                <dd>{candidate.lastVerified}</dd>
              </div>
              <div>
                <dt>Task</dt>
                <dd>{candidate.reviewTask?.status ?? "Needs task"}</dd>
              </div>
            </dl>

            <div className="reviewStrip">
              <span>Copy: {candidate.reviewTask?.copyStatus ?? "missing"}</span>
              <span>Food check: {candidate.reviewTask?.foodCopyCheck ?? "missing"}</span>
              <span>Due: {candidate.reviewTask?.nextActionDue ?? "missing"}</span>
            </div>

            <p className="notes">{candidate.notes}</p>
            {candidate.sourceUrl ? (
              <a href={candidate.sourceUrl} className="sourceLink">
                Open source
              </a>
            ) : (
              <span className="disabledLink">Source needed</span>
            )}
          </article>
          ))}
        </section>
      )}
    </main>
  );
}
