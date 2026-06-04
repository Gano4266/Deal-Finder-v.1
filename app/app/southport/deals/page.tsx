import Link from "next/link";
import type { Route } from "next";
import { PublicDealCard } from "../../public-deal-card";
import { SearchForm } from "../../search-form";
import {
  type PublicDeal,
  dealRunsOnPublicDay,
  getSouthportDeals,
  publicDealDayOptions,
  summarizePublicDealsByDay,
} from "../../../lib/data";
import { dealMatchesMealFilter, mealFilterOptions, type MealFilter } from "../../../lib/meal-filter";
import { matchesSearchQuery, normalizeSearchQuery } from "../../../lib/public-search";

export const dynamic = "force-dynamic";

type SouthportDealsPageProps = {
  searchParams?: Promise<{
    day?: string;
    q?: string;
    quick?: string;
  }>;
};

function queryFor(day: string, q: string, quick: string) {
  const query = new URLSearchParams();

  if (day !== "All") {
    query.set("day", day);
  }

  if (q) {
    query.set("q", q);
  }

  if (quick !== "all") {
    query.set("quick", quick);
  }

  const queryText = query.toString();
  return queryText ? `/southport/deals?${queryText}` : "/southport/deals";
}

function parseMealFilter(value?: string): MealFilter {
  return mealFilterOptions.some((option) => option.value === value) ? value as MealFilter : "all";
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

export default async function SouthportDealsPage({ searchParams }: SouthportDealsPageProps) {
  const params = await searchParams;
  const selectedSearchQuery = normalizeSearchQuery(params?.q);
  const deals = await getSouthportDeals();
  const dayOptions = ["All", ...publicDealDayOptions] as const;
  const selectedDay = dayOptions.includes((params?.day ?? "All") as (typeof dayOptions)[number])
    ? params?.day ?? "All"
    : "All";
  const selectedQuickFilter = parseMealFilter(params?.quick);
  const searchFilteredDeals = deals.filter((deal) => matchesDealSearch(deal, selectedSearchQuery));
  const quickFilteredDeals = searchFilteredDeals.filter((deal) => dealMatchesMealFilter(deal, selectedQuickFilter));
  const visibleDeals = quickFilteredDeals.filter((deal) => selectedDay === "All" || dealRunsOnPublicDay(deal, selectedDay));
  const dayCounts = new Map(summarizePublicDealsByDay(quickFilteredDeals).map((item) => [item.day, item.count]));
  const daySearchFilteredDeals = searchFilteredDeals.filter((deal) => selectedDay === "All" || dealRunsOnPublicDay(deal, selectedDay));
  const countForDay = (day: (typeof dayOptions)[number]) => day === "All" ? quickFilteredDeals.length : dayCounts.get(day) ?? 0;
  const countForMeal = (quickFilter: (typeof mealFilterOptions)[number]["value"]) =>
    daySearchFilteredDeals.filter((deal) => dealMatchesMealFilter(deal, quickFilter)).length;
  const visibleMealOptions = mealFilterOptions.filter((option) => option.value === "all" || countForMeal(option.value) > 0 || option.value === selectedQuickFilter);
  const singleDayDeals = visibleDeals.filter((deal) => deal.scheduleKind === "single_day");
  const recurringDeals = visibleDeals.filter((deal) => deal.scheduleKind === "recurring");

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Southport preview</p>
          <h1>All Southport deals</h1>
          <p>
            A separate soft-pilot list of reviewed Southport and Oak Island
            food specials.
          </p>
          <p className="notes">
            These specials do not appear in the main Wilmington feed.
          </p>
        </div>
        <Link href="/southport" className="secondaryLink">
          Today
        </Link>
      </section>

      <nav className="segmentedNav compactFilters" aria-label="Southport navigation">
        <Link href="/southport">
          <span>Today</span>
        </Link>
        <Link href="/southport/deals" className="active" aria-current="page">
          <span>All Deals</span>
          <strong>{deals.length}</strong>
        </Link>
        <Link href="/southport/restaurants">
          <span>Restaurants</span>
        </Link>
      </nav>

      <SearchForm
        action="/southport/deals"
        clearHref={queryFor(selectedDay, "", selectedQuickFilter)}
        hiddenFields={[
          selectedDay !== "All" ? { name: "day", value: selectedDay } : undefined,
          selectedQuickFilter !== "all" ? { name: "quick", value: selectedQuickFilter } : undefined
        ].filter((field): field is { name: string; value: string } => Boolean(field))}
        label="Search Southport deals"
        placeholder="Try lunch, pizza, seafood..."
        query={selectedSearchQuery}
      />

      <nav className="segmentedNav compactFilters" aria-label="Filter Southport deals by meal">
        {visibleMealOptions.map((option) => (
          <Link
            key={option.value}
            href={queryFor(selectedDay, selectedSearchQuery, option.value) as Route}
            className={option.value === selectedQuickFilter ? "active" : ""}
            aria-current={option.value === selectedQuickFilter ? "page" : undefined}
          >
            <span>{option.label}</span>
            <strong>{countForMeal(option.value)}</strong>
          </Link>
        ))}
      </nav>

      <nav className="segmentedNav compactFilters" aria-label="Filter Southport deals by day">
        {dayOptions.map((day) => (
          <Link
            key={day}
            href={queryFor(day, selectedSearchQuery, selectedQuickFilter) as Route}
            className={day === selectedDay ? "active" : ""}
            aria-current={day === selectedDay ? "page" : undefined}
          >
            <span>{day}</span>
            <strong>{countForDay(day)}</strong>
          </Link>
        ))}
      </nav>

      {visibleDeals.length === 0 ? (
        <section className="emptyState" aria-label="No Southport deals yet">
          <p className="eyebrow">No matches yet</p>
          <h2>
            {selectedSearchQuery
              ? `No Southport food specials match "${selectedSearchQuery}" yet.`
              : "No Southport food specials match this view yet."}
          </h2>
          <p>
            Try another search, meal, or day while Forkcast keeps building the Southport read.
          </p>
          <div className="cardActions">
            <Link href="/southport/deals" className="primaryLink">
              All Deals
            </Link>
            <Link href="/southport" className="secondaryLink">
              Today
            </Link>
          </div>
        </section>
      ) : (
        <>
          {singleDayDeals.length > 0 ? (
            <section className="dealList" aria-label="Single-day Southport deals">
              <div className="sectionTitleRow">
                <div>
                  <p className="eyebrow">Southport</p>
                  <h2>One-day specials</h2>
                </div>
              </div>
              {singleDayDeals.map((deal) => (
                <PublicDealCard key={deal.dealId} deal={deal} variant="compact" />
              ))}
            </section>
          ) : null}

          {recurringDeals.length > 0 ? (
            <section className="secondaryDealSection" aria-label="Recurring Southport deals">
              <div className="sectionTitleRow">
                <div>
                  <p className="eyebrow">Southport</p>
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
