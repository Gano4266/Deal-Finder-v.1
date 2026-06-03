import Link from "next/link";
import type { Route } from "next";
import { PublicDealCard } from "../public-deal-card";
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
  const singleDayDeals = sortedDeals.filter((deal) => deal.scheduleKind === "single_day");
  const recurringDeals = sortedDeals.filter((deal) => deal.scheduleKind === "recurring");

  return (
    <main className="pageShell">
      <section className="heroBand">
        <div>
          <p className="eyebrow">Today&apos;s forecast</p>
          <h1>Today in Wilmington</h1>
          <p className="lede">
            Food specials listed for {day}, {dateLabel}.
          </p>
          <p className="notes">
            Details can change. Check the restaurant&apos;s latest post or site
            before you order.
          </p>
        </div>
        <div className="statusPanel" aria-label="Deal status">
          <span className="statusLabel">Today</span>
          <strong>{deals.length}</strong>
          <span>{stats.publicDealsPassingFilter} total listed deals</span>
        </div>
      </section>

      <nav className="dayCoverage" aria-label="Deal coverage by day">
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

      <nav className="segmentedNav compactFilters" aria-label="Deals today by area">
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

      <nav className="segmentedNav compactFilters" aria-label="Quick scans for today">
        <Link href={`/deals?day=${day}&quick=under-10` as Route}>
          <span>Under $10</span>
        </Link>
        <Link href={`/deals?day=${day}&quick=time-listed` as Route}>
          <span>Time listed</span>
        </Link>
      </nav>

      {deals.length === 0 ? (
        <section className="emptyState" aria-label="No public deals">
          <p className="eyebrow">Nothing listed for {day}</p>
          <h2>No specials are on the board for {day} yet.</h2>
          <p>
            Try another day while we keep adding Wilmington specials.
          </p>
          <Link href="/deals" className="primaryLink">
            See all deals
          </Link>
        </section>
      ) : (
        <>
          <section className="dealList" aria-label="Today specials">
            <div className="sectionTitleRow">
              <div>
                <p className="eyebrow">Worth checking first</p>
                <h2>Today&apos;s specials</h2>
              </div>
              <span className="countPill">{singleDayDeals.length}</span>
            </div>
            {singleDayDeals.map((deal) => (
              <PublicDealCard key={deal.dealId} deal={deal} />
            ))}
          </section>

          {recurringDeals.length > 0 ? (
            <section className="secondaryDealSection" aria-label="More deals available today">
              <div className="sectionTitleRow">
                <div>
                  <p className="eyebrow">Available other days too</p>
                  <h2>Also good today</h2>
                </div>
                <span className="countPill">{recurringDeals.length}</span>
              </div>
              <div className="dealList compactSecondaryList">
                {recurringDeals.map((deal) => (
                  <PublicDealCard key={deal.dealId} deal={deal} variant="secondary" />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
