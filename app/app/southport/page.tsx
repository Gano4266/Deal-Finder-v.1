import Link from "next/link";
import { PublicDealCard } from "../public-deal-card";
import { dealRunsOnPublicDay, getSouthportDeals, weekdayName, shortDate } from "../../lib/data";

export const dynamic = "force-dynamic";

type SouthportPageProps = {
  searchParams?: Promise<{
    view?: string;
  }>;
};

export default async function SouthportPage({ searchParams }: SouthportPageProps) {
  const params = await searchParams;
  const southportDeals = await getSouthportDeals();
  const view = params?.view === "all" ? "all" : "today";
  const isAllView = view === "all";
  const day = weekdayName();
  const dateLabel = shortDate();
  const todayDeals = southportDeals.filter((deal) => dealRunsOnPublicDay(deal, day));
  const visibleDeals = isAllView ? southportDeals : todayDeals;
  const singleDayDeals = visibleDeals.filter((deal) => deal.scheduleKind === "single_day");
  const recurringDeals = visibleDeals.filter((deal) => deal.scheduleKind === "recurring");
  const sectionLabel = isAllView ? "Southport specials" : "Food specials for today";

  return (
    <main className="pageShell">
      <section className="heroBand">
        <div>
          <p className="eyebrow">Southport preview / {day}, {dateLabel}</p>
          <h1>Today's forecast</h1>
          <p className="lede">A soft-pilot read on Southport specials worth checking.</p>
          <p className="notes">Details can change. Use "Report an issue" to send a local note.</p>
        </div>
        <div className="statusPanel" aria-label="Southport deal status">
          <span className="statusLabel">Southport</span>
          <strong>{southportDeals.length}</strong>
          <span>{isAllView ? "specials listed" : `${todayDeals.length} listed for ${day}`}</span>
        </div>
      </section>

      <nav className="segmentedNav compactFilters" aria-label="Southport navigation">
        <Link href="/southport" className={!isAllView ? "active" : ""} aria-current={!isAllView ? "page" : undefined}>
          <span>Today</span>
          <strong>{todayDeals.length}</strong>
        </Link>
        <Link href="/southport?view=all" className={isAllView ? "active" : ""} aria-current={isAllView ? "page" : undefined}>
          <span>All Southport</span>
          <strong>{southportDeals.length}</strong>
        </Link>
      </nav>

      {southportDeals.length === 0 ? (
        <section className="emptyState" aria-label="No Southport deals yet">
          <p className="eyebrow">Southport preview</p>
          <h2>No Southport food specials are ready yet.</h2>
          <p>
            The Southport page is open as a soft pilot. Specials will appear
            here once they are ready for diners to use.
          </p>
          <p>
            In the meantime, see what&apos;s on in Wilmington.
          </p>
          <Link href="/tonight" className="primaryLink">
            Wilmington tonight
          </Link>
        </section>
      ) : (
        <>
          {visibleDeals.length === 0 ? (
            <section className="emptyState" aria-label="No Southport deals today">
              <p className="eyebrow">{isAllView ? "Nothing listed yet" : `Nothing listed for ${day}`}</p>
              <h2>
                {isAllView
                  ? "No Southport specials are ready yet."
                  : `No Southport specials are on the board for ${day}.`}
              </h2>
              <p>
                <Link href="/southport?view=all" className="primaryLink">
                  See all Southport deals
                </Link>
              </p>
            </section>
          ) : (
            <>
              {singleDayDeals.length > 0 ? (
                <section className="dealList" aria-label={sectionLabel}>
                  <div className="sectionTitleRow">
                    <div>
                      <p className="eyebrow">Southport / {isAllView ? "All listed" : day}</p>
                      <h2>{sectionLabel}</h2>
                    </div>
                  </div>
                  {singleDayDeals.map((deal) => (
                    <PublicDealCard key={deal.dealId} deal={deal} />
                  ))}
                </section>
              ) : null}

              {recurringDeals.length > 0 ? (
                <section className="dealList compactDealList" aria-label="Recurring Southport deals">
                  <div className="sectionTitleRow">
                    <div>
                      <p className="eyebrow">Recurring specials</p>
                      <h2>{isAllView ? "Daily and multi-day deals" : "Also available today"}</h2>
                    </div>
                  </div>
                  {recurringDeals.map((deal) => (
                    <PublicDealCard key={deal.dealId} deal={deal} variant="compact" />
                  ))}
                </section>
              ) : null}
            </>
          )}

          {!isAllView && southportDeals.length > todayDeals.length ? (
            <section className="secondaryDealSection">
              <p className="eyebrow">More Southport deals</p>
              <Link href="/southport?view=all" className="secondaryLink">
                See all {southportDeals.length} Southport deals
              </Link>
            </section>
          ) : null}
        </>
      )}

      <section className="secondaryDealSection">
        <p className="eyebrow">About this preview</p>
        <p className="notes">
          Southport is a separate soft-pilot market, so these specials do not
          appear in the main Wilmington feed.
        </p>
        <Link href="/report" className="secondaryLink">
          Report a wrong or stale deal
        </Link>
      </section>
    </main>
  );
}
