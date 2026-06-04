import Link from "next/link";
import type { Route } from "next";
import { getOpenReviewCandidates, getPrototypeStats } from "../../../lib/data";

export const dynamic = "force-dynamic";

type ReviewPageProps = {
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
  return queryText ? `/admin/review?${queryText}` : "/admin/review";
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const [candidates, stats] = await Promise.all([
    getOpenReviewCandidates(),
    getPrototypeStats()
  ]);
  const areaOptions = [
    "All",
    ...Array.from(new Set(candidates.map((candidate) => candidate.areaName || "Wilmington seeds"))).sort()
  ];
  const selectedArea = areaOptions.includes(params?.area ?? "All") ? params?.area ?? "All" : "All";
  const visibleCandidates = candidates.filter((candidate) =>
    selectedArea === "All" || (candidate.areaName || "Wilmington seeds") === selectedArea
  );
  const countForArea = (area: string) =>
    area === "All"
      ? candidates.length
      : candidates.filter((candidate) => (candidate.areaName || "Wilmington seeds") === area).length;

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
            {stats.publicDealsPassingFilter} public prototype deals are approved / {visibleCandidates.length} open rows in this view.
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

      <nav className="segmentedNav compactFilters" aria-label="Filter review queue by intake area">
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

      {visibleCandidates.length === 0 ? (
        <section className="emptyState" aria-label="No open reviews">
          <p className="eyebrow">Review queue clear</p>
          <h2>No source-backed candidates need review in this view.</h2>
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
          {visibleCandidates.map((candidate) => {
            const priority = candidate.reviewTask?.priority ?? "";
            const riskFlags = candidate.reviewTask?.riskFlags
              ? candidate.reviewTask.riskFlags.split(";").map((f) => f.trim()).filter(Boolean)
              : [];

            return (
            <article key={candidate.candidateId} className={["candidateCard", priority].filter(Boolean).join(" ")}>
              <div className="candidateMain">
                <p className="eyebrow">
                  {candidate.areaName || "Wilmington seeds"} / {candidate.dealDay} / {candidate.timeWindow}
                  {priority === "critical" && <span className="priorityTag critical">Critical</span>}
                  {priority === "high" && <span className="priorityTag high">High</span>}
                </p>
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
                  <dd>{candidate.lastVerified || "Not verified"}</dd>
                </div>
                <div>
                  <dt>Action due</dt>
                  <dd>{candidate.reviewTask?.nextActionDue ?? "Missing"}</dd>
                </div>
              </dl>

              <div className="reviewStrip">
                <span>{candidate.origin === "research_intake" ? "Research intake" : "Seed backlog"}</span>
                {candidate.intakeFolder ? <span>{candidate.intakeFolder}</span> : null}
                {candidate.locationScopeStatus ? <span>Scope: {candidate.locationScopeStatus}</span> : null}
                <span>Copy: {candidate.reviewTask?.copyStatus ?? "missing"}</span>
                <span>Food check: {candidate.reviewTask?.foodCopyCheck ?? "missing"}</span>
                {riskFlags.map((flag) => (
                  <span key={flag} className="riskFlag">{flag.replace(/_/g, " ")}</span>
                ))}
              </div>

              <p className="notes">{candidate.notes}</p>
              {candidate.publishBlockReason ? (
                <p className="notes">Public block: {candidate.publishBlockReason}</p>
              ) : null}
              {candidate.sourceUrl ? (
                <a href={candidate.sourceUrl} className="sourceLink">
                  Open source
                </a>
              ) : (
                <span className="disabledLink">No source on file</span>
              )}
            </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
