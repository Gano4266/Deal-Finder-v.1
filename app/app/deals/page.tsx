import Link from "next/link";
import type { Route } from "next";
import { PublicDealCard } from "../public-deal-card";
import { SearchForm } from "../search-form";
import {
  type PublicDeal,
  dealRunsOnPublicDay,
  getPublicDeals,
  publicAreaGroupOptions,
  publicDealDayOptions,
  summarizePublicDealsByArea,
  summarizePublicDealsByDay
} from "../../lib/data";
import { dealMatchesMealFilter, type MealFilter, mealFilterOptions } from "../../lib/meal-filter";
import { firstDollarPriceValue } from "../../lib/price-filter";
import { matchesSearchQuery, normalizeSearchQuery } from "../../lib/public-search";

type DealsPageProps = {
  searchParams?: Promise<{
    area?: string;
    day?: string;
    meal?: string;
    q?: string;
    quick?: string;
    sort?: string;
  }>;
};

const quickFilterOptions = [
  { value: "all", label: "All" },
  { value: "under-10", label: "$10 & under" },
  { value: "time-listed", label: "Time shown" }
] as const;

const sortOptions = [
  { value: "day", label: "Day" },
  { value: "area", label: "Area" },
  { value: "restaurant", label: "Restaurant" }
] as const;

type QuickFilter = (typeof quickFilterOptions)[number]["value"];

function isMealFilter(value: string | undefined): value is MealFilter {
  return mealFilterOptions.some((option) => option.value === value);
}

function isQuickFilter(value: string | undefined): value is QuickFilter {
  return quickFilterOptions.some((option) => option.value === value);
}

function quickLabel(quick: QuickFilter): string {
  return quickFilterOptions.find((option) => option.value === quick)?.label ?? "All";
}

function sortLabel(sort: string): string {
  return sortOptions.find((option) => option.value === sort)?.label ?? "Area";
}

function queryFor(params: { day: string; area: string; meal: string; q: string; quick: string; sort: string }) {
  const query = new URLSearchParams();

  if (params.day !== "All") {
    query.set("day", params.day);
  }

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

  if (params.sort !== "area") {
    query.set("sort", params.sort);
  }

  const queryText = query.toString();
  return queryText ? `/deals?${queryText}` : "/deals";
}

function firstDayRank(daysAvailable: string): number {
  const normalizedDays = daysAvailable.toLowerCase();

  if (normalizedDays.includes("daily") || normalizedDays.includes("every day") || normalizedDays.includes("weekdays")) {
    return 0;
  }

  const ranks = publicDealDayOptions.map((day) => daysAvailable.includes(day) ? publicDealDayOptions.indexOf(day) : -1);
  const visibleRanks = ranks.filter((rank) => rank >= 0);
  return visibleRanks.length ? Math.min(...visibleRanks) : publicDealDayOptions.length;
}

function matchesQuickFilter(deal: PublicDeal, quickFilter: QuickFilter): boolean {
  if (quickFilter === "under-10") {
    const value = firstDollarPriceValue(deal.price);
    return typeof value === "number" && value <= 10;
  }

  if (quickFilter === "time-listed") {
    return deal.timeWindow !== "N/A";
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

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams;
  const selectedSearchQuery = normalizeSearchQuery(params?.q);
  const dayOptions = ["All", ...publicDealDayOptions] as const;
  const selectedDay = dayOptions.includes((params?.day ?? "All") as (typeof dayOptions)[number])
    ? params?.day ?? "All"
    : "All";
  const selectedSort = sortOptions.some((option) => option.value === params?.sort) ? params?.sort ?? "area" : "area";
  const legacyMealFilter = isMealFilter(params?.quick) && params?.quick !== "all" ? params.quick : undefined;
  const selectedMealFilter = isMealFilter(params?.meal) ? params.meal : legacyMealFilter ?? "all";
  const selectedQuickFilter = isQuickFilter(params?.quick) ? params.quick : "all";
  const deals = await getPublicDeals();
  const areaOptions = ["All", ...publicAreaGroupOptions] as const;
  const selectedArea = areaOptions.includes((params?.area ?? "All") as (typeof areaOptions)[number])
    ? params?.area ?? "All"
    : "All";
  const visibleDeals = deals
    .filter((deal) => selectedDay === "All" || dealRunsOnPublicDay(deal, selectedDay))
    .filter((deal) => selectedArea === "All" || deal.areaGroup === selectedArea)
    .filter((deal) => matchesDealSearch(deal, selectedSearchQuery))
    .filter((deal) => dealMatchesMealFilter(deal, selectedMealFilter))
    .filter((deal) => matchesQuickFilter(deal, selectedQuickFilter))
    .sort((left, right) => {
      if (selectedSort === "area") {
        return left.areaGroup.localeCompare(right.areaGroup) ||
          left.area.localeCompare(right.area) ||
          left.restaurantName.localeCompare(right.restaurantName);
      }

      if (selectedSort === "restaurant") {
        return left.restaurantName.localeCompare(right.restaurantName) || left.publicTitle.localeCompare(right.publicTitle);
      }

      return firstDayRank(left.daysAvailable) - firstDayRank(right.daysAvailable) ||
        left.restaurantName.localeCompare(right.restaurantName);
    });
  const emptyHeading = selectedSearchQuery
    ? `No specials match "${selectedSearchQuery}" yet.`
    : selectedArea === "All"
    ? "No specials match this view yet."
    : `No ${selectedArea} food specials match this view yet.`;
  const emptyCopy = selectedSearchQuery
    ? "Try another search, day, area, or quick filter."
    : selectedArea === "All"
    ? "Try another day, area, or quick filter."
    : "Try another day or clear the filters while Forkcast keeps expanding the local read.";
  const singleDayDeals = visibleDeals.filter((deal) => deal.scheduleKind === "single_day");
  const recurringDeals = visibleDeals.filter((deal) => deal.scheduleKind === "recurring");
  const searchFilteredDeals = deals.filter((deal) => matchesDealSearch(deal, selectedSearchQuery));
  const areaFilteredDeals = searchFilteredDeals.filter((deal) => selectedArea === "All" || deal.areaGroup === selectedArea);
  const dayFilteredDeals = searchFilteredDeals.filter((deal) => selectedDay === "All" || dealRunsOnPublicDay(deal, selectedDay));
  const dayAreaFilteredDeals = deals
    .filter((deal) => selectedDay === "All" || dealRunsOnPublicDay(deal, selectedDay))
    .filter((deal) => selectedArea === "All" || deal.areaGroup === selectedArea)
    .filter((deal) => matchesDealSearch(deal, selectedSearchQuery));
  const dayCounts = new Map(summarizePublicDealsByDay(
    areaFilteredDeals
      .filter((deal) => dealMatchesMealFilter(deal, selectedMealFilter))
      .filter((deal) => matchesQuickFilter(deal, selectedQuickFilter))
  ).map((item) => [item.day, item.count]));
  const areaCounts = new Map(summarizePublicDealsByArea(
    dayFilteredDeals
      .filter((deal) => dealMatchesMealFilter(deal, selectedMealFilter))
      .filter((deal) => matchesQuickFilter(deal, selectedQuickFilter))
  ).map((item) => [item.area, item.count]));
  const countForMealFilter = (mealFilter: MealFilter) =>
    dayAreaFilteredDeals
      .filter((deal) => matchesQuickFilter(deal, selectedQuickFilter))
      .filter((deal) => dealMatchesMealFilter(deal, mealFilter)).length;
  const countForQuickFilter = (quickFilter: QuickFilter) =>
    dayAreaFilteredDeals
      .filter((deal) => dealMatchesMealFilter(deal, selectedMealFilter))
      .filter((deal) => matchesQuickFilter(deal, quickFilter)).length;
  const countForDay = (day: (typeof dayOptions)[number]) =>
    day === "All"
      ? areaFilteredDeals
        .filter((deal) => dealMatchesMealFilter(deal, selectedMealFilter))
        .filter((deal) => matchesQuickFilter(deal, selectedQuickFilter)).length
      : dayCounts.get(day) ?? 0;
  const countForArea = (area: (typeof areaOptions)[number]) => {
    if (area === "All") {
      return dayFilteredDeals
        .filter((deal) => dealMatchesMealFilter(deal, selectedMealFilter))
        .filter((deal) => matchesQuickFilter(deal, selectedQuickFilter)).length;
    }

    return areaCounts.get(area) ?? 0;
  };
  const secondaryFilterSummary = [
    selectedArea === "All" ? "Area: All" : `Area: ${selectedArea}`,
    selectedMealFilter === "all" ? "Meal: All" : `Meal: ${mealFilterOptions.find((option) => option.value === selectedMealFilter)?.label ?? selectedMealFilter}`,
    selectedQuickFilter === "all" ? "More: All" : quickLabel(selectedQuickFilter),
    `Sort: ${sortLabel(selectedSort)}`
  ].join(" · ");

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">All deals</p>
          <h1>Food specials worth knowing</h1>
          <p>
            Browse food specials by day, area, price, and restaurant. Today
            only shows deals matching today&apos;s weekday.
          </p>
          <p className="notes">
            Details can change. Check the restaurant&apos;s latest post or site
            before you order.
          </p>
        </div>
        <Link href="/tonight" className="secondaryLink">
          Today
        </Link>
      </section>

      <section className="filterDock dealsFilterDock" aria-label="Search and filter deals">
        <SearchForm
          action="/deals"
          clearHref={queryFor({ day: selectedDay, area: selectedArea, meal: selectedMealFilter, q: "", quick: selectedQuickFilter, sort: selectedSort })}
          hiddenFields={[
            selectedDay !== "All" ? { name: "day", value: selectedDay } : undefined,
            selectedArea !== "All" ? { name: "area", value: selectedArea } : undefined,
            selectedMealFilter !== "all" ? { name: "meal", value: selectedMealFilter } : undefined,
            selectedQuickFilter !== "all" ? { name: "quick", value: selectedQuickFilter } : undefined,
            selectedSort !== "area" ? { name: "sort", value: selectedSort } : undefined
          ].filter((field): field is { name: string; value: string } => Boolean(field))}
          label="Search deals"
          placeholder="Search tacos, burgers, lunch..."
          query={selectedSearchQuery}
        />

        <div className="filterDockGroup dayFilterGroup">
          <p className="eyebrow">Day</p>
          <nav className="segmentedNav compactFilters" aria-label="Filter deals by day">
            {dayOptions.map((day) => (
              <Link
                key={day}
                href={queryFor({ day, area: selectedArea, meal: selectedMealFilter, q: selectedSearchQuery, quick: selectedQuickFilter, sort: selectedSort }) as Route}
                className={day === selectedDay ? "active" : ""}
                aria-current={day === selectedDay ? "page" : undefined}
              >
                <span>{day}</span>
                <strong>{countForDay(day)}</strong>
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
            <div className="filterDockGroup areaFilterGroup">
              <p className="eyebrow">Area</p>
              <nav className="segmentedNav compactFilters" aria-label="Filter deals by area">
                {areaOptions.map((area) => (
                  <Link
                    key={area}
                    href={queryFor({ day: selectedDay, area, meal: selectedMealFilter, q: selectedSearchQuery, quick: selectedQuickFilter, sort: selectedSort }) as Route}
                    className={area === selectedArea ? "active" : ""}
                    aria-current={area === selectedArea ? "page" : undefined}
                  >
                    <span>{area}</span>
                    <strong>{countForArea(area)}</strong>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="filterDockGroup mealFilterGroup">
              <p className="eyebrow">Meal</p>
              <nav className="segmentedNav compactFilters" aria-label="Filter deals by meal">
                {mealFilterOptions.map((option) => (
                  <Link
                    key={option.value}
                    href={queryFor({ day: selectedDay, area: selectedArea, meal: option.value, q: selectedSearchQuery, quick: selectedQuickFilter, sort: selectedSort }) as Route}
                    className={option.value === selectedMealFilter ? "active" : ""}
                    aria-current={option.value === selectedMealFilter ? "page" : undefined}
                  >
                    <span>{option.label}</span>
                    <strong>{countForMealFilter(option.value)}</strong>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="filterDockGroup compactFilterGroup">
              <p className="eyebrow">More filters</p>
              <nav className="segmentedNav compactFilters" aria-label="Filter deals by extra option">
                {quickFilterOptions.map((option) => (
                  <Link
                    key={option.value}
                    href={queryFor({ day: selectedDay, area: selectedArea, meal: selectedMealFilter, q: selectedSearchQuery, quick: option.value, sort: selectedSort }) as Route}
                    className={option.value === selectedQuickFilter ? "active" : ""}
                    aria-current={option.value === selectedQuickFilter ? "page" : undefined}
                  >
                    <span>{option.label}</span>
                    <strong>{countForQuickFilter(option.value)}</strong>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="filterDockGroup compactFilterGroup">
              <p className="eyebrow">Sort</p>
              <nav className="segmentedNav compactFilters" aria-label="Sort deals">
                {sortOptions.map((option) => (
                  <Link
                    key={option.value}
                    href={queryFor({ day: selectedDay, area: selectedArea, meal: selectedMealFilter, q: selectedSearchQuery, quick: selectedQuickFilter, sort: option.value }) as Route}
                    className={option.value === selectedSort ? "active" : ""}
                    aria-current={option.value === selectedSort ? "page" : undefined}
                  >
                    <span>{option.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </details>
      </section>

      <p className="resultSummary" aria-live="polite">
        Showing {visibleDeals.length} of {deals.length} specials.
      </p>

      {visibleDeals.length === 0 ? (
        <section className="emptyState" aria-label="No deals for selected day">
          <p className="eyebrow">No matches yet</p>
          <h2>{emptyHeading}</h2>
          <p>{emptyCopy}</p>
          <div className="cardActions">
            <Link href="/deals" className="primaryLink">
              All deals
            </Link>
            <Link href="/tonight" className="secondaryLink">
              Today
            </Link>
            <Link href="/report" className="secondaryLink">
              Report a missing special
            </Link>
          </div>
        </section>
      ) : (
        <>
          {singleDayDeals.length > 0 ? (
            <section className="dealList" aria-label="Day-specific deals">
              <div className="sectionTitleRow">
                <div>
                  <p className="eyebrow">Single-day specials</p>
                  <h2>One-day specials</h2>
                </div>
              </div>
              {singleDayDeals.map((deal) => (
                <PublicDealCard key={deal.dealId} deal={deal} variant="compact" />
              ))}
            </section>
          ) : null}

          {recurringDeals.length > 0 ? (
            <section className="secondaryDealSection" aria-label="Deals available more than one day">
              <div className="sectionTitleRow">
                <div>
                  <p className="eyebrow">Available other days too</p>
                  <h2>Recurring specials</h2>
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
