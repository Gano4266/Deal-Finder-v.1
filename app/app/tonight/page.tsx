import Link from "next/link";
import type { Route } from "next";
import { PublicDealCard } from "../public-deal-card";
import {
  getPublicDeals,
  getPublicTonightDeals,
  shortDate,
  summarizePublicDealsByArea,
  summarizePublicDealsByDay,
  weekdayName
} from "../../lib/data";

export const dynamic = "force-dynamic";

export default async function TonightPage() {
  const [deals, allDeals] = await Promise.all([
    getPublicTonightDeals(),
    getPublicDeals()
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
          <p className="eyebrow">{day}, {dateLabel}</p>
          <h1>Today's forecast</h1>
          <p className="lede">A quick read on food specials worth checking tonight.</p>
          <p className="notes">
            Verify details before you order. Specials can change or sell out.
          </p>
        </div>
        <div className="statusPanel" aria-label="Deal status">
          <span className="statusLabel">Today</span>
          <strong>{deals.length}</strong>
          <span>{deals.length === 1 ? "special listed" : "specials listed"}</span>
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
      </nav>

      {deals.length === 0 ? (
        <section className="emptyState" aria-label="No public deals">
          <p className="eyebrow">Nothing listed for {day}</p>
          <h2>No specials are on the board for {day} yet.</h2>
          <p>
            Try another day while Forkcast keeps widening the local read.
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
                <h2>Today's specials</h2>
              </div>
            </div>
            {singleDayDeals.map((deal) => (
              <PublicDealCard key={deal.dealId} deal={deal} />
            ))}
          </section>

          {recurringDeals.length > 0 ? (
            <section className="secondaryDealSection" aria-label="More deals available today">
              <div className="sectionTitleRow">
                <div>
                  <p className="eyebrow">Also good today</p>
                  <h2>Daily and multi-day specials</h2>
                </div>
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
