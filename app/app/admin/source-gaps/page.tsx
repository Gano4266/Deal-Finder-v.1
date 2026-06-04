import Link from "next/link";
import type { Route } from "next";
import { getSourceGaps, sourceGapAreaGroupOptions } from "../../../lib/data";

export const dynamic = "force-dynamic";

type SourceGapsPageProps = {
  searchParams?: Promise<{
    area?: string;
  }>;
};

function queryFor(area: string) {
  const query = new URLSearchParams();

  if (area !== "All") {
    query.set("area", area);
  }

  const queryText = query.toString();
  return queryText ? `/admin/source-gaps?${queryText}` : "/admin/source-gaps";
}

export default async function SourceGapsPage({ searchParams }: SourceGapsPageProps) {
  const params = await searchParams;
  const gaps = await getSourceGaps();
  const areaOptions = ["All", ...sourceGapAreaGroupOptions] as const;
  const selectedArea = areaOptions.includes((params?.area ?? "All") as (typeof areaOptions)[number])
    ? params?.area ?? "All"
    : "All";
  const visibleGaps = gaps.filter((gap) => selectedArea === "All" || gap.areaGroup === selectedArea);
  const criticalCount = visibleGaps.filter((gap) => gap.priority === "critical").length;
  const needsReviewTotal = visibleGaps.reduce((total, gap) => total + gap.needsReviewCount, 0);
  const countForArea = (area: (typeof areaOptions)[number]) =>
    area === "All" ? gaps.length : gaps.filter((gap) => gap.areaGroup === area).length;

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Source ops</p>
          <h1>Source gaps</h1>
          <p>
            Static report for Wilmington seeds plus research intake batches. Use
            this to decide which restaurants need source capture, direct
            confirmation, or deal review before public rows are promoted.
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

      <nav className="segmentedNav compactFilters" aria-label="Filter source gaps by area">
        {areaOptions.map((area) => (
          <Link
            key={area}
            href={queryFor(area) as Route}
            className={area === selectedArea ? "active" : ""}
            aria-current={area === selectedArea ? "page" : undefined}
          >
            <span>{area}</span>
            <strong>{countForArea(area)}</strong>
          </Link>
        ))}
      </nav>

      <section className="gapList" aria-label="Source gap report">
        {visibleGaps.map((gap) => (
          <article key={gap.restaurantName} className={`gapCard ${gap.priority}`}>
            <div>
              <p className="eyebrow">{gap.priority}</p>
              <h2>{gap.restaurantName}</h2>
              <p className="locationLine">{gap.areaGroup} / {gap.locationArea}</p>
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
              {gap.origin === "research_intake" ? (
                <span>{gap.intakeFolder}</span>
              ) : null}
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
