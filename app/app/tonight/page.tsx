import Link from "next/link";
import type { Route } from "next";
import {
  getPrototypeStats,
  getPublicDeals,
  getPublicTonightDeals,
  shortDate,
  summarizePublicDealsByArea,
  summarizePublicDealsByDay,
  weekdayName
} from "../../lib/data";

export const dynamic = "force-dynamic";

export default async function TonightPage() {
  const [deals, allDeals, stats] = await Promise.all([
    getPublicTonightDeals(),
    getPublicDeals(),
    getPrototypeStats()
  ]);
  const day = weekdayName();
  const dateLabel = shortDate();
  const dayCounts = summarizePublicDealsByDay(allDeals);
  const areaCounts = summarizePublicDealsByArea(deals);
  const sortedDeals = [...deals].sort(
    (left, right) =>
      left.areaGroup.localeCompare(right.areaGroup) ||
      left.restaurantName.localeCompare(right.restaurantName)
  );

  return (
    <main className="pageShell">
      <section className="heroBand">
        <div>
          <p className="eyebrow">Verified food deals</p>
          <h1>Tonight in Wilmington</h1>
          <p className="lede">
            Showing reviewed static prototype rows matching {day}, {dateLabel}.
            Every listed deal has source evidence and a recheck date.
          </p>
          <p className="notes">
            Static prototype data, not live availability. Confirm details with
            the listed official source before ordering.
          </p>
        </div>
        <div className="statusPanel" aria-label="Prototype status">
          <span className="statusLabel">Reviewed tonight</span>
          <strong>{deals.length}</strong>
          <span>{stats.publicDealsPassingFilter} total reviewed deals</span>
        </div>
      </section>

      <nav className="dayCoverage" aria-label="Reviewed deal coverage by day">
        {dayCounts.map(({ day: dayOption, count }) => (
          <Link
            key={dayOption}
            href={`/deals?day=${dayOption}` as Route}
            className={dayOption === day ? "active" : ""}
            aria-current={dayOption === day ? "page" : undefined}
          >
            <span>{dayOption.slice(0, 3)}</span>
            <strong>{count}</strong>
          </Link>
        ))}
      </nav>

      <nav className="segmentedNav compactFilters" aria-label="Reviewed tonight by area">
        {areaCounts.map(({ area, count }) => (
          <Link
            key={area}
            href={`/deals?day=${day}&area=${encodeURIComponent(area)}&sort=area` as Route}
          >
            <span>{area}</span>
            <strong>{count}</strong>
          </Link>
        ))}
      </nav>

      <nav className="segmentedNav compactFilters" aria-label="Quick scans for tonight">
        <Link href={`/deals?day=${day}&quick=under-10` as Route}>
          <span>Under $10</span>
        </Link>
        <Link href={`/deals?day=${day}&quick=time-listed` as Route}>
          <span>Time listed</span>
        </Link>
        <Link href={`/deals?day=${day}&quick=carryout` as Route}>
          <span>Takeout verified</span>
        </Link>
      </nav>

      {deals.length === 0 ? (
        <section className="emptyState" aria-label="No public deals">
          <p className="eyebrow">Nothing listed for {day}</p>
          <h2>No reviewed food deals are listed for tonight yet.</h2>
          <p>
            The reviewed prototype has deals on other days. Check all reviewed
            deals while more Wilmington sources are being confirmed.
          </p>
          <Link href="/deals" className="primaryLink">
            See all reviewed deals
          </Link>
        </section>
      ) : (
        <section className="dealList" aria-label="Public deals">
          {sortedDeals.map((deal) => (
            <article key={deal.dealId} className="dealCard">
              <div>
                <p className="eyebrow">{deal.restaurantName}</p>
                <h2>{deal.publicTitle}</h2>
                <div className="badgeRow" aria-label="Deal verification">
                  <span>{deal.evidenceLabel}</span>
                  <span>{deal.areaGroup}</span>
                  <span>{deal.sourceDisplayName}</span>
                  <span>Verified {deal.lastVerifiedAt}</span>
                  <span>{deal.freshnessLabel}</span>
                  {deal.takeout ? <span>Takeout verified</span> : null}
                  {deal.delivery ? <span>Delivery verified</span> : null}
                </div>
                <p>{deal.publicDescription}</p>
                <p className="locationLine">{deal.neighborhood || deal.address}</p>
              </div>
              <dl className="factGrid">
                <div>
                  <dt>Price</dt>
                  <dd>{deal.price || "See source"}</dd>
                </div>
                <div>
                  <dt>When</dt>
                  <dd>{deal.daysAvailableLabel} {deal.timeWindow}</dd>
                </div>
                <div>
                  <dt>Checked</dt>
                  <dd>{deal.lastVerifiedAt}</dd>
                </div>
                <div>
                  <dt>Recheck</dt>
                  <dd>{deal.nextCheckDue || deal.expiresOn}</dd>
                </div>
              </dl>
              <div className="cardActions">
                <Link href={`/deals/${deal.dealId}`} className="primaryLink">
                  Details
                </Link>
                <a href={deal.sourceUrl} className="secondaryLink">
                  Official source
                </a>
                <Link href={`/report?dealId=${deal.dealId}` as Route} className="secondaryLink">
                  Report issue
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
