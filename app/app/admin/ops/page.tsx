import Link from "next/link";
import type { Route } from "next";
import { getOpsDashboard } from "../../../lib/data";

export const dynamic = "force-dynamic";

function dueLabel(daysUntilDue: number | undefined): string {
  if (daysUntilDue === undefined) {
    return "No due date";
  }

  if (daysUntilDue < 0) {
    return `${Math.abs(daysUntilDue)} day${daysUntilDue === -1 ? "" : "s"} overdue`;
  }

  if (daysUntilDue === 0) {
    return "Due today";
  }

  return `Due in ${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`;
}

export default async function AdminOpsPage() {
  const dashboard = await getOpsDashboard();

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Admin ops</p>
          <h1>Ops dashboard</h1>
          <p>
            Read-only health check for the static Wilmington prototype. These
            numbers summarize reviewed public rows, source freshness, evidence
            durability, and the seed backlog.
          </p>
          <p className="reviewMeta">
            Generated for Wilmington operating date {dashboard.generatedForDate}.
          </p>
        </div>
        <div className="headerActions">
          <Link href="/admin/review" className="secondaryLink">
            Review queue
          </Link>
          <Link href={"/admin/source-gaps" as Route} className="secondaryLink">
            Source gaps
          </Link>
          <Link href="/tonight" className="secondaryLink">
            Public feed
          </Link>
        </div>
      </section>

      <section className="summaryStrip" aria-label="Ops snapshot">
        <div>
          <span className="statusLabel">Public feed</span>
          <strong>{dashboard.stats.publicDealsPassingFilter}</strong>
          <span>{dashboard.stats.tonightVisibleDeals} match tonight</span>
        </div>
        <div>
          <span className="statusLabel">Open review tasks</span>
          <strong>{dashboard.stats.openSeedReviewTasks}</strong>
          <span>
            {dashboard.stats.criticalSeedReviewTasks} critical / {dashboard.stats.highSeedReviewTasks} high
          </span>
        </div>
        <div>
          <span className="statusLabel">Due soon</span>
          <strong>{dashboard.stats.dueSoonDeals}</strong>
          <span>{dashboard.stats.overdueDeals} overdue public deals</span>
        </div>
      </section>

      <section className="opsGrid" aria-label="Ops health">
        <article className="detailPanel">
          <p className="eyebrow">Public health</p>
          <dl className="factGrid">
            <div>
              <dt>Fixture rows</dt>
              <dd>{dashboard.stats.publicRows}</dd>
            </div>
            <div>
              <dt>Blocked rows</dt>
              <dd>{dashboard.stats.publicBlockedRows}</dd>
            </div>
            <div>
              <dt>Direct confirmations</dt>
              <dd>{dashboard.stats.directConfirmations}</dd>
            </div>
            <div>
              <dt>Report inbox</dt>
              <dd>{dashboard.stats.reportInboxConfigured ? "configured" : "not configured"}</dd>
            </div>
          </dl>
        </article>

        <article className="detailPanel">
          <p className="eyebrow">Fixture inventory</p>
          <dl className="factGrid">
            <div>
              <dt>Restaurants</dt>
              <dd>{dashboard.stats.restaurants}</dd>
            </div>
            <div>
              <dt>Sources</dt>
              <dd>{dashboard.stats.sources}</dd>
            </div>
            <div>
              <dt>Captures / checks</dt>
              <dd>{dashboard.stats.sourceCaptures} / {dashboard.stats.sourceChecks}</dd>
            </div>
            <div>
              <dt>Audit events</dt>
              <dd>{dashboard.stats.auditEvents}</dd>
            </div>
          </dl>
        </article>

        <article className="detailPanel">
          <p className="eyebrow">Backlog</p>
          <dl className="factGrid">
            <div>
              <dt>Verified seeds</dt>
              <dd>{dashboard.stats.verifiedSeedCandidates}</dd>
            </div>
            <div>
              <dt>Needs review</dt>
              <dd>{dashboard.stats.needsReviewSeedCandidates}</dd>
            </div>
            <div>
              <dt>Terminal seeds</dt>
              <dd>{dashboard.stats.terminalSeedCandidates}</dd>
            </div>
            <div>
              <dt>Source gaps</dt>
              <dd>{dashboard.stats.criticalSourceGaps} critical</dd>
            </div>
          </dl>
        </article>

        <article className="detailPanel">
          <p className="eyebrow">Freshness</p>
          <dl className="factGrid">
            <div>
              <dt>Source checks due soon</dt>
              <dd>{dashboard.stats.dueSoonSourceChecks}</dd>
            </div>
            <div>
              <dt>Overdue source checks</dt>
              <dd>{dashboard.stats.overdueSourceChecks}</dd>
            </div>
            <div>
              <dt>Failed source checks</dt>
              <dd>{dashboard.stats.failedSourceChecks}</dd>
            </div>
            <div>
              <dt>Carryout seeds</dt>
              <dd>{dashboard.stats.verifiedCarryoutPlaces} visible / {dashboard.stats.hiddenCarryoutPlaces} hidden</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="opsSection" aria-label="Recheck queue">
        <div className="sectionTitleRow">
          <div>
            <p className="eyebrow">Freshness queue</p>
            <h2>Public deal rechecks</h2>
          </div>
          <Link href="/admin/review" className="secondaryLink">
            Review queue
          </Link>
        </div>
        <div className="gapList">
          {dashboard.recheckQueue.length === 0 ? (
            <article className="gapCard">
              <h3>No public deal rechecks are due within the current horizon.</h3>
              <p className="notes">Keep weekly source checks moving before the freshness window closes.</p>
            </article>
          ) : (
            dashboard.recheckQueue.map((deal) => (
              <article key={deal.dealId} className={`gapCard ${deal.dueStatus === "overdue" ? "critical" : "high"}`}>
                <div>
                  <p className="eyebrow">{dueLabel(deal.daysUntilDue)}</p>
                  <h3>{deal.restaurantName}</h3>
                  <p className="dealTitle">{deal.publicTitle}</p>
                  <p className="notes">Next check due {deal.nextCheckDue || "missing"}.</p>
                </div>
                <div className="badgeRow">
                  <span>{deal.sourceTier}</span>
                  <span>{deal.daysAvailableLabel}</span>
                  <span>{deal.timeWindow}</span>
                </div>
                <div className="cardActions">
                    <Link href={`/deals/${deal.dealId}` as Route} className="primaryLink">
                    Deal detail
                  </Link>
                  <a href={deal.sourceUrl} className="secondaryLink">
                    Open source
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="opsSection" aria-label="Evidence hardening">
        <div className="sectionTitleRow">
          <div>
            <p className="eyebrow">Evidence hardening</p>
            <h2>Durability checks</h2>
          </div>
          <span className="disabledLink">{dashboard.stats.evidenceGapDeals} rows to harden</span>
        </div>
        <div className="gapList">
          {dashboard.evidenceGapDeals.slice(0, 6).map((deal) => (
            <article key={deal.dealId} className="gapCard">
              <div>
                <h3>{deal.publicTitle}</h3>
                <p className="notes">
                  These are not automatic publish blockers if the public gate passes, but they are the next evidence durability work.
                </p>
              </div>
              <div className="badgeRow">
                {deal.evidenceGaps.map((gap) => (
                  <span key={gap}>{gap}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="opsGrid" aria-label="Backlog and integrity">
        <article className="detailPanel">
          <p className="eyebrow">Review risk</p>
          <h2>Highest open items</h2>
          <div className="miniDealList">
            {dashboard.openReviewCandidates.slice(0, 5).map((candidate) => (
              <div key={candidate.candidateId} className="miniDeal">
                <span>{candidate.restaurantName}</span>
                <small>{candidate.dealTitle}</small>
                <small>{candidate.reviewTask?.priority ?? "priority missing"} / due {candidate.reviewTask?.nextActionDue ?? "missing"}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="detailPanel">
          <p className="eyebrow">Source coverage</p>
          <h2>Top gaps</h2>
          <div className="miniDealList">
            {dashboard.sourceGaps.slice(0, 5).map((gap) => (
              <div key={gap.restaurantName} className="miniDeal">
                <span>{gap.restaurantName}</span>
                <small>{gap.priority} / {gap.sourceStatus}</small>
                <small>{gap.blockers.join("; ") || "No blockers logged"}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="detailPanel">
          <p className="eyebrow">Data integrity</p>
          <h2>Manifest health</h2>
          {dashboard.manifestDrift.length === 0 ? (
            <p className="notes">Fixture manifest counts match current CSV row counts.</p>
          ) : (
            <div className="miniDealList">
              {dashboard.manifestDrift.map((item) => (
                <div key={item.key} className="miniDeal">
                  <span>{item.key}</span>
                  <small>manifest {item.expected} / actual {item.actual}</small>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="detailPanel">
          <p className="eyebrow">Reports</p>
          <h2>Correction intake</h2>
          <p className="notes">
            Reports remain a static mailto handoff. Configure `NEXT_PUBLIC_REPORT_EMAIL`
            before relying on user or restaurant corrections.
          </p>
          <div className="cardActions">
            <Link href={"/report" as Route} className="primaryLink">
              Report page
            </Link>
          </div>
        </article>
      </section>

      <section className="opsSection" aria-label="Recent promotions">
        <div className="sectionTitleRow">
          <div>
            <p className="eyebrow">Audit log</p>
            <h2>Recent promotions</h2>
          </div>
        </div>
        <div className="gapList">
          {dashboard.recentAuditEvents.map((event) => (
            <article key={event.auditEventId} className="gapCard">
              <div>
                <p className="eyebrow">{event.eventAt}</p>
                <h3>{event.summary}</h3>
                <p className="notes">Actor: {event.actor}</p>
              </div>
              <div className="badgeRow">
                <span>{event.dealId}</span>
                <span>{event.evidenceRef}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
