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
import {
  defaultMealFilterForDeals,
  dealMatchesMealFilter,
  type MealFilter,
  mealFilterOptions
} from "../../lib/meal-filter";
import { firstDollarPriceValue } from "../../lib/price-filter";
import { matchesSearchQuery, normalizeSearchQuery } from "../../lib/public-search";

export const dynamic = "force-dynamic";

type TonightPageProps = {
  searchParams?: Promise<{
    area?: string;
    meal?: string;
    q?: string;
    quick?: string;
  }>;
};

const quickFilterOptions = [
  { value: "all", label: "All" },
  { value: "under-10", label: "$10 & under" }
] as const;

type QuickFilter = (typeof quickFilterOptions)[number]["value"];

function isMealFilter(value: string | undefined): value is MealFilter {
  return mealFilterOptions.some((option) => option.value === value);
}

function isQuickFilter(value: string | undefined): value is QuickFilter {
  return quickFilterOptions.some((option) => option.value === value);
}

function mealLabel(meal: MealFilter): string {
  return mealFilterOptions.find((option) => option.value === meal)?.label ?? "All";
}

function quickLabel(quick: QuickFilter): string {
  return quickFilterOptions.find((option) => option.value === quick)?.label ?? "All";
}

function queryFor(params: { area: string; meal: string; q: string; quick: string }) {
  const query = new URLSearchParams();

  if (params.area !== "All") {
    query.set("area", params.area);
  }

  if (params.meal !== "all") {
    query.set("meal", params.meal);
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

function matchesQuickFilter(deal: PublicDeal, quickFilter: QuickFilter): boolean {
  if (quickFilter === "under-10") {
    const value = firstDollarPriceValue(deal.price);
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
  const legacyMealFilter = isMealFilter(params?.quick) && params?.quick !== "all" ? params.quick : undefined;
  const requestedMealFilter = isMealFilter(params?.meal) ? params.meal : legacyMealFilter;
  const selectedQuickFilter = isQuickFilter(params?.quick) ? params.quick : "all";
  const [deals, allDeals] = await Promise.all([
    getPublicTonightDeals(),
    getPublicDeals()
  ]);
  const day = weekdayName();
  const dateLabel = shortDate();
  const dayCounts = summarizePublicDealsByDay(allDeals);
  const searchFilteredDeals = deals.filter((deal) => matchesDealSearch(deal, selectedSearchQuery));
  const selectedMealFilter = requestedMealFilter ?? defaultMealFilterForDeals(searchFilteredDeals.length > 0 ? searchFilteredDeals : deals);
  const mealFilteredDeals = searchFilteredDeals.filter((deal) => dealMatchesMealFilter(deal, selectedMealFilter));
  const quickFilteredDeals = mealFilteredDeals.filter((deal) => matchesQuickFilter(deal, selectedQuickFilter));
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
  const countForMealFilter = (mealFilter: MealFilter) =>
    searchFilteredDeals
      .filter((deal) => selectedArea === "All" || deal.areaGroup === selectedArea)
      .filter((deal) => matchesQuickFilter(deal, selectedQuickFilter))
      .filter((deal) => dealMatchesMealFilter(deal, mealFilter)).length;
  const countForQuickFilter = (quickFilter: QuickFilter) =>
    searchFilteredDeals
      .filter((deal) => selectedArea === "All" || deal.areaGroup === selectedArea)
      .filter((deal) => dealMatchesMealFilter(deal, selectedMealFilter))
      .filter((deal) => matchesQuickFilter(deal, quickFilter)).length;
  const automaticMealMessage =
    requestedMealFilter === undefined && selectedMealFilter !== "all"
      ? ` Defaulted to ${mealLabel(selectedMealFilter).toLowerCase()} based on current local time.`
      : "";
  const secondaryFilterSummary = [
    selectedArea === "All" ? "Area: All" : `Area: ${selectedArea}`,
    selectedQuickFilter === "all" ? "More: All" : quickLabel(selectedQuickFilter)
  ].join(" · ");
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

      <section className="filterDock tonightFilterDock" aria-label="Search and filters for today">
        <SearchForm
          action="/tonight"
          clearHref={queryFor({ area: selectedArea, meal: selectedMealFilter, q: "", quick: selectedQuickFilter })}
          hiddenFields={[
            selectedArea !== "All" ? { name: "area", value: selectedArea } : undefined,
            selectedMealFilter !== "all" ? { name: "meal", value: selectedMealFilter } : undefined,
            selectedQuickFilter !== "all" ? { name: "quick", value: selectedQuickFilter } : undefined
          ].filter((field): field is { name: string; value: string } => Boolean(field))}
          label="Search today's deals"
          placeholder="Search tacos, burgers, lunch..."
          query={selectedSearchQuery}
        />

        <div className="filterDockGroup mealFilterGroup">
          <p className="eyebrow">Meal</p>
          <nav className="segmentedNav compactFilters" aria-label="Filter today's deals by meal">
            {mealFilterOptions.map((option) => (
              <Link
                key={option.value}
                href={queryFor({ area: selectedArea, meal: option.value, q: selectedSearchQuery, quick: selectedQuickFilter }) as Route}
                className={option.value === selectedMealFilter ? "active" : ""}
                aria-current={option.value === selectedMealFilter ? "page" : undefined}
              >
                <span>{option.label}</span>
                <strong>{countForMealFilter(option.value)}</strong>
              </Link>
            ))}
          </nav>
        </div>

        <details className="filterDisclosure">
          <summary>
            <span>Filters</span>
            <small>{secondaryFilterSummary}</small>
          </summary>
          <div className="filterDisclosureBody">
            <div className="filterDockGroup">
              <p className="eyebrow">Area</p>
              <nav className="segmentedNav compactFilters" aria-label="Deals today by area">
                {areaOptions.map((area) => (
                  <Link
                    key={area}
                    href={queryFor({ area, meal: selectedMealFilter, q: selectedSearchQuery, quick: selectedQuickFilter }) as Route}
                    className={area === selectedArea ? "active" : ""}
                    aria-current={area === selectedArea ? "page" : undefined}
                  >
                    <span>{area}</span>
                    <strong>{countForArea(area)}</strong>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="filterDockGroup compactFilterGroup">
              <p className="eyebrow">More filters</p>
              <nav className="segmentedNav compactFilters" aria-label="Filter today's deals by extra option">
                {quickFilterOptions.map((option) => (
                  <Link
                    key={option.value}
                    href={queryFor({ area: selectedArea, meal: selectedMealFilter, q: selectedSearchQuery, quick: option.value }) as Route}
                    className={option.value === selectedQuickFilter ? "active" : ""}
                    aria-current={option.value === selectedQuickFilter ? "page" : undefined}
                  >
                    <span>{option.label}</span>
                    <strong>{countForQuickFilter(option.value)}</strong>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </details>
      </section>

      <p className="resultSummary" aria-live="polite">
        Showing {visibleDeals.length} of {deals.length} specials for today.{automaticMealMessage}
      </p>

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
            <Link href="/report" className="secondaryLink">
              Report a missing special
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
