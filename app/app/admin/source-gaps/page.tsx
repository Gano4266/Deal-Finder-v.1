import Link from "next/link";
import { getSourceGaps } from "../../../lib/data";

export const dynamic = "force-dynamic";

export default async function SourceGapsPage() {
  const gaps = await getSourceGaps();
  const criticalCount = gaps.filter((gap) => gap.priority === "critical").length;
  const needsReviewTotal = gaps.reduce((total, gap) => total + gap.needsReviewCount, 0);

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Source ops</p>
          <h1>Wilmington source gaps</h1>
          <p>
            Static report for the Wilmington seed/source set. Use this to decide
            which restaurants need source capture, direct confirmation, or deal
            review before more public rows are promoted.
          </p>
          <p className="reviewMeta">
            {criticalCount} critical rows / {needsReviewTotal} candidates need review.
          </p>
        </div>
        <div className="headerActions">
          <Link href="/admin" className="secondaryLink">
            Ops dashboard
          </Link>
          <Link href="/admin/review" className="secondaryLink">
            Review queue
          </Link>
        </div>
      </section>

      <section className="gapList" aria-label="Source gap report">
        {gaps.map((gap) => (
          <article key={gap.restaurantName} className={`gapCard ${gap.priority}`}>
            <div>
              <p className="eyebrow">{gap.priority}</p>
              <h2>{gap.restaurantName}</h2>
              <p className="locationLine">{gap.locationArea}</p>
              <p>{gap.notes}</p>
            </div>

            <dl className="factGrid">
              <div>
                <dt>Source</dt>
                <dd>{gap.sourceStatus}</dd>
              </div>
              <div>
                <dt>Candidates</dt>
                <dd>{gap.candidateCount}</dd>
              </div>
              <div>
                <dt>Needs review</dt>
                <dd>{gap.needsReviewCount}</dd>
              </div>
              <div>
                <dt>Verified seeds</dt>
                <dd>{gap.verifiedCandidateCount}</dd>
              </div>
            </dl>

            <div className="badgeRow">
              {gap.blockers.length === 0 ? (
                <span>No blockers logged</span>
              ) : (
                gap.blockers.map((blocker) => <span key={blocker}>{blocker}</span>)
              )}
            </div>

            <div className="cardActions">
              {gap.primarySourceUrl ? (
                <a href={gap.primarySourceUrl} className="primaryLink">
                  Open source
                </a>
              ) : (
                <span className="disabledLink">Source needed</span>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
