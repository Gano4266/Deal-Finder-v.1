import Link from "next/link";
import type { Route } from "next";
import { PublicDealCard } from "../public-deal-card";
import { SearchForm } from "../search-form";
import {
  type PublicDeal,
  getPublicDeals,
  getPublicTonightDeals,
  shortDate,
  summarizePublicDealsByArea,
  summarizePublicDealsByDay,
  weekdayName
} from "../../lib/data";
import { dealMatchesMealFilter, mealFilterOptions } from "../../lib/meal-filter";
import { matchesSearchQuery, normalizeSearchQuery } from "../../lib/public-search";

export const dynamic = "force-dynamic";

type TonightPageProps = {
  searchParams?: Promise<{
    area?: string;
    q?: string;
    quick?: string;
  }>;
};

const quickFilterOptions = [
  { value: "all", label: "All" },
  ...mealFilterOptions.filter((option) => option.value !== "all"),
  { value: "under-10", label: "Under $10" }
] as const;

function queryFor(params: { area: string; q: string; quick: string }) {
  const query = new URLSearchParams();

  if (params.area !== "All") {
    query.set("area", params.area);
  }

  if (params.q) {
    query.set("q", params.q);
  }

  if (params.quick !== "all") {
    query.set("quick", params.quick);
  }

  const queryText = query.toString();
  return queryText ? `/tonight?${queryText}` : "/tonight";
}

function firstPriceValue(price: string): number | undefined {
  const match = price.match(/\$?\s*(\d+(?:\.\d{1,2})?)/);

  if (!match) {
    return undefined;
  }

  return Number(match[1]);
}

function matchesQuickFilter(deal: PublicDeal, quickFilter: string): boolean {
  if (quickFilter === "breakfast" || quickFilter === "lunch" || quickFilter === "dinner") {
    return dealMatchesMealFilter(deal, quickFilter);
  }

  if (quickFilter === "under-10") {
    const value = firstPriceValue(deal.price);
    return typeof value === "number" && value <= 10;
  }

  return true;
}

function matchesDealSearch(deal: PublicDeal, query: string): boolean {
  return matchesSearchQuery([
    deal.restaurantName,
    deal.publicTitle,
    deal.publicDescription,
    deal.dealType,
    deal.price,
    deal.daysAvailableLabel,
    deal.scheduleLabel,
    deal.timeWindow,
    deal.neighborhood,
    deal.area,
    deal.areaGroup,
    deal.address,
    deal.restrictionNotes,
    deal.sourceName
  ], query);
}

export default async function TonightPage({ searchParams }: TonightPageProps) {
  const params = await searchParams;
  const selectedSearchQuery = normalizeSearchQuery(params?.q);
  const selectedQuickFilter = quickFilterOptions.some((option) => option.value === params?.quick)
    ? params?.quick ?? "all"
    : "all";
  const [deals, allDeals] = await Promise.all([
    getPublicTonightDeals(),
    getPublicDeals()
  ]);
  const day = weekdayName();
  const dateLabel = shortDate();
  const dayCounts = summarizePublicDealsByDay(allDeals);
  const searchFilteredDeals = deals.filter((deal) => matchesDealSearch(deal, selectedSearchQuery));
  const quickFilteredDeals = searchFilteredDeals.filter((deal) => matchesQuickFilter(deal, selectedQuickFilter));
  const areaOptions = ["All", ...summarizePublicDealsByArea(quickFilteredDeals).map(({ area }) => area)] as const;
  const selectedArea = areaOptions.includes((params?.area ?? "All") as (typeof areaOptions)[number])
    ? params?.area ?? "All"
    : "All";
  const visibleDeals = quickFilteredDeals.filter((deal) => selectedArea === "All" || deal.areaGroup === selectedArea);
  const sortedDeals = [...visibleDeals].sort(
    (left, right) =>
      left.areaGroup.localeCompare(right.areaGroup) ||
      left.restaurantName.localeCompare(right.restaurantName)
  );
  const singleDayDeals = sortedDeals.filter((deal) => deal.scheduleKind === "single_day");
  const recurringDeals = sortedDeals.filter((deal) => deal.scheduleKind === "recurring");
  const dayAreaCounts = new Map(summarizePublicDealsByArea(quickFilteredDeals).map((item) => [item.area, item.count]));
  const countForArea = (area: (typeof areaOptions)[number]) =>
    area === "All" ? quickFilteredDeals.length : dayAreaCounts.get(area) ?? 0;
  const countForQuickFilter = (quickFilter: (typeof quickFilterOptions)[number]["value"]) =>
    searchFilteredDeals
      .filter((deal) => selectedArea === "All" || deal.areaGroup === selectedArea)
      .filter((deal) => matchesQuickFilter(deal, quickFilter)).length;
  const emptyHeading = selectedSearchQuery
    ? `No specials match "${selectedSearchQuery}" for today.`
    : selectedArea === "All"
    ? "No specials match this view for today."
    : `No ${selectedArea} food specials match this view for today.`;

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
        {areaOptions.map((area) => (
          <Link
            key={area}
            href={queryFor({ area, q: selectedSearchQuery, quick: selectedQuickFilter }) as Route}
            className={area === selectedArea ? "active" : ""}
            aria-current={area === selectedArea ? "page" : undefined}
          >
            <span>{area}</span>
            <strong>{countForArea(area)}</strong>
          </Link>
        ))}
      </nav>

      <SearchForm
        action="/tonight"
        clearHref={queryFor({ area: selectedArea, q: "", quick: selectedQuickFilter })}
        hiddenFields={[
          selectedArea !== "All" ? { name: "area", value: selectedArea } : undefined,
          selectedQuickFilter !== "all" ? { name: "quick", value: selectedQuickFilter } : undefined
        ].filter((field): field is { name: string; value: string } => Boolean(field))}
        label="Search today's deals"
        placeholder="Try tacos, pizza, burger, lunch..."
        query={selectedSearchQuery}
      />

      <section className="filterPanel" aria-label="Meal and quick filters for today">
        <div>
          <p className="eyebrow">Meal & quick</p>
          <nav className="segmentedNav compactFilters" aria-label="Filter today's deals by meal or quick option">
            {quickFilterOptions.map((option) => (
              <Link
                key={option.value}
                href={queryFor({ area: selectedArea, q: selectedSearchQuery, quick: option.value }) as Route}
                className={option.value === selectedQuickFilter ? "active" : ""}
                aria-current={option.value === selectedQuickFilter ? "page" : undefined}
              >
                <span>{option.label}</span>
                <strong>{countForQuickFilter(option.value)}</strong>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {visibleDeals.length === 0 ? (
        <section className="emptyState" aria-label="No public deals">
          <p className="eyebrow">No matches yet</p>
          <h2>{emptyHeading}</h2>
          <p>
            Try another search, meal, or area while Forkcast keeps widening the local read.
          </p>
          <div className="cardActions">
            <Link href="/tonight" className="primaryLink">
              Clear today filters
            </Link>
            <Link href="/deals" className="secondaryLink">
              See all deals
            </Link>
          </div>
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
