import Link from "next/link";
import type { Route } from "next";
import { PublicDealCard } from "../public-deal-card";
import { SearchForm } from "../search-form";
import { TodayLocationClient } from "../today-location-client";
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
import { sortDealsForSelectedArea } from "../../lib/today-location";

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
  { value: "open-now", label: "Open now" },
  { value: "happy-hour", label: "Happy hour" },
  { value: "under-10", label: "$10 & under" },
  { value: "takeout", label: "Takeout" }
] as const;

type QuickFilter = (typeof quickFilterOptions)[number]["value"];

type IntentChip =
  | { kind: "quick"; value: QuickFilter; label: string }
  | { kind: "meal"; value: MealFilter; label: string };

const intentChips: IntentChip[] = [
  { kind: "quick", value: "open-now", label: "Open now" },
  { kind: "quick", value: "happy-hour", label: "Happy hour" },
  { kind: "meal", value: "dinner", label: "Dinner" },
  { kind: "meal", value: "lunch", label: "Lunch" },
  { kind: "quick", value: "under-10", label: "$10 & under" },
  { kind: "quick", value: "takeout", label: "Takeout" }
];

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

function minutesFromTime(value: string): number | undefined {
  const [hourText, minuteText = "0"] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return undefined;
  }

  return hour * 60 + minute;
}

function currentMinutes(date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0") % 24;
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");

  return hour * 60 + minute;
}

function isOpenNow(deal: PublicDeal): boolean {
  const start = minutesFromTime(deal.startTime);
  const end = minutesFromTime(deal.endTime);

  if (start === undefined || end === undefined) {
    return false;
  }

  const now = currentMinutes();

  if (end < start) {
    return now >= start || now <= end;
  }

  return now >= start && now <= end;
}

function searchableDealText(deal: PublicDeal): string {
  return [
    deal.publicTitle,
    deal.publicDescription,
    deal.dealType,
    deal.restrictionNotes,
    deal.evidenceSummary,
    deal.sourceQuote,
    deal.sourceName,
    deal.sourceDisplayName,
    deal.area,
    deal.areaGroup
  ].join(" ").toLowerCase();
}

function isHappyHourFoodDeal(deal: PublicDeal): boolean {
  const text = searchableDealText(deal);
  return text.includes("happy hour") || text.includes("bar bites");
}

function supportsTakeout(deal: PublicDeal): boolean {
  const text = searchableDealText(deal);
  return deal.takeout || text.includes("takeout") || text.includes("pickup") || text.includes("carryout") || text.includes("to go");
}

function matchesQuickFilter(deal: PublicDeal, quickFilter: QuickFilter): boolean {
  if (quickFilter === "under-10") {
    const value = firstDollarPriceValue(deal.price);
    return typeof value === "number" && value <= 10;
  }

  if (quickFilter === "open-now") {
    return isOpenNow(deal);
  }

  if (quickFilter === "happy-hour") {
    return isHappyHourFoodDeal(deal);
  }

  if (quickFilter === "takeout") {
    return supportsTakeout(deal);
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
  const areaOptions = ["All", ...summarizePublicDealsByArea(quickFilteredDeals).map(({ area }) => area)];
  const selectedArea = areaOptions.includes(params?.area ?? "All") ? params?.area ?? "All" : "All";
  const visibleDeals = quickFilteredDeals;
  const sortedDeals = sortDealsForSelectedArea(visibleDeals, selectedArea);
  const singleDayDeals = sortedDeals.filter((deal) => deal.scheduleKind === "single_day");
  const recurringDeals = sortedDeals.filter((deal) => deal.scheduleKind === "recurring");
  const dayAreaCounts = new Map(summarizePublicDealsByArea(quickFilteredDeals).map((item) => [item.area, item.count]));
  const countForArea = (area: string) =>
    area === "All" ? quickFilteredDeals.length : dayAreaCounts.get(area as never) ?? 0;
  const countForMealFilter = (mealFilter: MealFilter) =>
    searchFilteredDeals
      .filter((deal) => matchesQuickFilter(deal, selectedQuickFilter))
      .filter((deal) => dealMatchesMealFilter(deal, mealFilter)).length;
  const countForQuickFilter = (quickFilter: QuickFilter) =>
    searchFilteredDeals
      .filter((deal) => dealMatchesMealFilter(deal, selectedMealFilter))
      .filter((deal) => matchesQuickFilter(deal, quickFilter)).length;
  const countForIntentChip = (chip: IntentChip) =>
    chip.kind === "meal" ? countForMealFilter(chip.value) : countForQuickFilter(chip.value);
  const isIntentChipActive = (chip: IntentChip) =>
    chip.kind === "meal" ? chip.value === selectedMealFilter : chip.value === selectedQuickFilter;
  const hrefForIntentChip = (chip: IntentChip) =>
    chip.kind === "meal"
      ? queryFor({ area: selectedArea, meal: chip.value, q: selectedSearchQuery, quick: selectedQuickFilter })
      : queryFor({ area: selectedArea, meal: selectedMealFilter, q: selectedSearchQuery, quick: chip.value });
  const automaticMealMessage =
    requestedMealFilter === undefined && selectedMealFilter !== "all"
      ? ` Defaulted to ${mealLabel(selectedMealFilter).toLowerCase()} based on current local time.`
      : "";
  const areaFocusMessage = selectedArea === "All" ? "" : ` ${selectedArea} is prioritized first.`;
  const secondaryFilterSummary = [
    selectedArea === "All" ? "Area focus: All" : `Area focus: ${selectedArea}`,
    selectedQuickFilter === "all" ? "More: All" : quickLabel(selectedQuickFilter)
  ].join(" · ");
  const emptyHeading = selectedSearchQuery
    ? `No specials match "${selectedSearchQuery}" for today.`
    : "No specials match this view for today.";

  return (
    <main className="pageShell">
      <section className="heroBand">
        <div>
          <p className="eyebrow">{day}, {dateLabel}</p>
          <h1>Today's forecast</h1>
          <p className="lede">
            {selectedArea === "All"
              ? "A quick read on food specials worth checking tonight."
              : `${selectedArea} specials first, with useful options across Wilmington after that.`}
          </p>
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

      <section className="todayFocusPanel" aria-label="Today view controls">
        <div className="todayFocusCopy">
          <p className="eyebrow">Today mode</p>
          <h2>{selectedArea === "All" ? "All Wilmington" : `${selectedArea} first`}</h2>
          <p>
            {selectedArea === "All"
              ? "Choose an intent or area to make the feed more useful."
              : "This is area-aware sorting without using your exact location."}
          </p>
        </div>
        <div className="todayFocusControls">
          <nav className="intentChipNav" aria-label="Quick today filters">
            <Link
              href={queryFor({ area: selectedArea, meal: "all", q: selectedSearchQuery, quick: "all" }) as Route}
              className={selectedMealFilter === "all" && selectedQuickFilter === "all" ? "active" : ""}
              aria-current={selectedMealFilter === "all" && selectedQuickFilter === "all" ? "page" : undefined}
            >
              <span>All today</span>
              <strong>{searchFilteredDeals.length}</strong>
            </Link>
            {intentChips.map((chip) => (
              <Link
                key={`${chip.kind}-${chip.value}`}
                href={hrefForIntentChip(chip) as Route}
                className={isIntentChipActive(chip) ? "active" : ""}
                aria-current={isIntentChipActive(chip) ? "page" : undefined}
              >
                <span>{chip.label}</span>
                <strong>{countForIntentChip(chip)}</strong>
              </Link>
            ))}
          </nav>
          <nav className="areaChipNav" aria-label="Prioritize today's deals by area">
            {areaOptions.map((area) => (
              <Link
                key={area}
                href={queryFor({ area, meal: selectedMealFilter, q: selectedSearchQuery, quick: selectedQuickFilter }) as Route}
                className={area === selectedArea ? "active" : ""}
                aria-current={area === selectedArea ? "page" : undefined}
              >
                <span>{area === "All" ? "All Wilmington" : area}</span>
                <strong>{countForArea(area)}</strong>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <TodayLocationClient
        selectedArea={selectedArea}
        areaOptions={areaOptions}
        selectedMeal={selectedMealFilter}
        selectedQuick={selectedQuickFilter}
        selectedSearchQuery={selectedSearchQuery}
      />

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

        <details className="filterDisclosure">
          <summary>
            <span>More filters</span>
            <small>{secondaryFilterSummary}</small>
          </summary>
          <div className="filterDisclosureBody">
            <div className="filterDockGroup">
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

            <div className="filterDockGroup compactFilterGroup">
              <p className="eyebrow">More</p>
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
        Showing {visibleDeals.length} of {deals.length} specials for today.{automaticMealMessage}{areaFocusMessage}
      </p>

      {visibleDeals.length === 0 ? (
        <section className="emptyState" aria-label="No public deals">
          <p className="eyebrow">No matches yet</p>
          <h2>{emptyHeading}</h2>
          <p>
            Try another search, intent, or area while Forkcast keeps widening the local read.
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
              <PublicDealCard key={deal.dealId} deal={deal} selectedArea={selectedArea} />
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
                  <PublicDealCard key={deal.dealId} deal={deal} selectedArea={selectedArea} variant="secondary" />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
