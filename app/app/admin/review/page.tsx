import Link from "next/link";
import type { Route } from "next";
import { getOpenReviewCandidates, getPrototypeStats } from "../../../lib/data";

export const dynamic = "force-dynamic";

type ReviewPageProps = {
  searchParams?: Promise<{
    area?: string;
    focus?: string;
  }>;
};

const focusOptions = [
  "All",
  "Review first",
  "Date-sensitive",
  "Boundary",
  "Service unknown",
  "Copy needed"
] as const;

type FocusOption = (typeof focusOptions)[number];

function queryFor(area: string, focus: FocusOption) {
  const query = new URLSearchParams();

  if (area !== "All") {
    query.set("area", area);
  }

  if (focus !== "All") {
    query.set("focus", focus);
  }

  const queryText = query.toString();
  return queryText ? `/admin/review?${queryText}` : "/admin/review";
}

function flagsFor(candidate: Awaited<ReturnType<typeof getOpenReviewCandidates>>[number]) {
  return [
    candidate.reviewTask?.riskFlags,
    candidate.uncertaintyFlags,
    candidate.publishBlockReason
  ]
    .filter(Boolean)
    .join(";")
    .toLowerCase();
}

function matchesFocus(candidate: Awaited<ReturnType<typeof getOpenReviewCandidates>>[number], focus: FocusOption) {
  const flags = flagsFor(candidate);
  const priority = candidate.reviewTask?.priority ?? "";

  if (focus === "All") {
    return true;
  }

  if (focus === "Review first") {
    return priority === "critical" || priority === "high";
  }

  if (focus === "Date-sensitive") {
    return Boolean(candidate.expiresOn) || flags.includes("date_windowed") || flags.includes("expires");
  }

  if (focus === "Boundary") {
    return flags.includes("boundary") || (candidate.locationScopeStatus ?? "").includes("boundary");
  }

  if (focus === "Service unknown") {
    return flags.includes("service_mode_unknown") || (candidate.serviceModeSummary ?? "").includes("unknown");
  }

  return flags.includes("public_copy") || flags.includes("copy needed") || flags.includes("copy_not_approved");
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
  const selectedFocus = focusOptions.includes((params?.focus ?? "All") as FocusOption)
    ? (params?.focus ?? "All") as FocusOption
    : "All";
  const candidatesForArea = candidates.filter((candidate) =>
    selectedArea === "All" || (candidate.areaName || "Wilmington seeds") === selectedArea
  );
  const visibleCandidates = candidatesForArea.filter((candidate) => matchesFocus(candidate, selectedFocus));
  const countForArea = (area: string) =>
    area === "All"
      ? candidates.length
      : candidates.filter((candidate) => (candidate.areaName || "Wilmington seeds") === area).length;
  const countForFocus = (focus: FocusOption) =>
    candidatesForArea.filter((candidate) => matchesFocus(candidate, focus)).length;

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
            href={queryFor(area, selectedFocus) as Route}
            className={area === selectedArea ? "active" : ""}
            aria-current={area === selectedArea ? "page" : undefined}
          >
            <span>{area}</span>
            <strong>{countForArea(area)}</strong>
          </Link>
        ))}
      </nav>

      <nav className="segmentedNav compactFilters" aria-label="Filter review queue by triage focus">
        {focusOptions.map((focus) => (
          <Link
            key={focus}
            href={queryFor(selectedArea, focus) as Route}
            className={focus === selectedFocus ? "active" : ""}
            aria-current={focus === selectedFocus ? "page" : undefined}
          >
            <span>{focus}</span>
            <strong>{countForFocus(focus)}</strong>
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
                <div>
                  <dt>Freshness</dt>
                  <dd>{candidate.expiresOn ? `Expires ${candidate.expiresOn}` : candidate.nextCheckDue ? `Check ${candidate.nextCheckDue}` : "Missing"}</dd>
                </div>
                <div>
                  <dt>Service</dt>
                  <dd>{candidate.serviceModeSummary ?? "Not captured"}</dd>
                </div>
              </dl>

              <div className="reviewStrip">
                <span>{candidate.origin === "research_intake" ? "Research intake" : "Seed backlog"}</span>
                {candidate.intakeFolder ? <span>{candidate.intakeFolder}</span> : null}
                {candidate.locationScopeStatus ? <span>Scope: {candidate.locationScopeStatus}</span> : null}
                {candidate.sourceCaptureId ? <span>Evidence: {candidate.sourceCaptureId}</span> : null}
                <span>Copy: {candidate.reviewTask?.copyStatus ?? "missing"}</span>
                <span>Food check: {candidate.reviewTask?.foodCopyCheck ?? "missing"}</span>
                {candidate.publicGateSummary ? <span>Gate: {candidate.publicGateSummary}</span> : null}
                {riskFlags.map((flag) => (
                  <span key={flag} className="riskFlag">{flag.replace(/_/g, " ")}</span>
                ))}
              </div>

              {(candidate.reviewTask?.nextAction || candidate.reviewReason || candidate.evidencePath) ? (
                <div className="reviewActionPanel">
                  {candidate.reviewTask?.nextAction ? (
                    <p><strong>Next action:</strong> {candidate.reviewTask.nextAction}</p>
                  ) : null}
                  {candidate.reviewReason ? (
                    <p><strong>Review reason:</strong> {candidate.reviewReason}</p>
                  ) : null}
                  {candidate.evidencePath ? (
                    <p><strong>Evidence path:</strong> <code>{candidate.evidencePath}</code></p>
                  ) : null}
                </div>
              ) : null}

              <p className="notes">{candidate.notes}</p>
              {candidate.publishBlockReason ? (
                <p className="notes">Public block: {candidate.publishBlockReason}</p>
              ) : null}
              {candidate.sourceUrl ? (
                <div className="cardActions">
                  <Link
                    href={`/admin/review/${encodeURIComponent(candidate.candidateId)}` as Route}
                    className="primaryLink"
                  >
                    Review packet
                  </Link>
                  <a href={candidate.sourceUrl} className="secondaryLink">
                    Open source
                  </a>
                </div>
              ) : (
                <div className="cardActions">
                  <Link
                    href={`/admin/review/${encodeURIComponent(candidate.candidateId)}` as Route}
                    className="primaryLink"
                  >
                    Review packet
                  </Link>
                  <span className="disabledLink">No source on file</span>
                </div>
              )}
            </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
