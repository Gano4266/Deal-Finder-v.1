import Link from "next/link";
import type { Route } from "next";
import { PublicDealCard } from "../public-deal-card";
import {
  type PublicDeal,
  dealRunsOnPublicDay,
  getPublicDeals,
  publicAreaGroupOptions,
  publicDealDayOptions,
  summarizePublicDealsByArea,
  summarizePublicDealsByDay
} from "../../lib/data";

type DealsPageProps = {
  searchParams?: Promise<{
    area?: string;
    day?: string;
    quick?: string;
    sort?: string;
  }>;
};

const quickFilterOptions = [
  { value: "all", label: "All" },
  { value: "under-10", label: "Under $10" },
  { value: "time-listed", label: "Time shown" }
] as const;

const sortOptions = [
  { value: "day", label: "Day" },
  { value: "area", label: "Area" },
  { value: "restaurant", label: "Restaurant" }
] as const;

function queryFor(params: { day: string; area: string; quick: string; sort: string }) {
  const query = new URLSearchParams();

  if (params.day !== "All") {
    query.set("day", params.day);
  }

  if (params.area !== "All") {
    query.set("area", params.area);
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

function firstPriceValue(price: string): number | undefined {
  const match = price.match(/\$?\s*(\d+(?:\.\d{1,2})?)/);

  if (!match) {
    return undefined;
  }

  return Number(match[1]);
}

function matchesQuickFilter(deal: PublicDeal, quickFilter: string): boolean {
  if (quickFilter === "under-10") {
    const value = firstPriceValue(deal.price);
    return typeof value === "number" && value <= 10;
  }

  if (quickFilter === "time-listed") {
    return deal.timeWindow !== "Time not listed";
  }

  return true;
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams;
  const dayOptions = ["All", ...publicDealDayOptions] as const;
  const selectedDay = dayOptions.includes((params?.day ?? "All") as (typeof dayOptions)[number])
    ? params?.day ?? "All"
    : "All";
  const selectedSort = sortOptions.some((option) => option.value === params?.sort) ? params?.sort ?? "area" : "area";
  const selectedQuickFilter = quickFilterOptions.some((option) => option.value === params?.quick)
    ? params?.quick ?? "all"
    : "all";
  const deals = await getPublicDeals();
  const areaOptions = ["All", ...publicAreaGroupOptions] as const;
  const selectedArea = areaOptions.includes((params?.area ?? "All") as (typeof areaOptions)[number])
    ? params?.area ?? "All"
    : "All";
  const visibleDeals = deals
    .filter((deal) => selectedDay === "All" || dealRunsOnPublicDay(deal, selectedDay))
    .filter((deal) => selectedArea === "All" || deal.areaGroup === selectedArea)
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
  const singleDayDeals = visibleDeals.filter((deal) => deal.scheduleKind === "single_day");
  const recurringDeals = visibleDeals.filter((deal) => deal.scheduleKind === "recurring");
  const areaFilteredDeals = deals.filter((deal) => selectedArea === "All" || deal.areaGroup === selectedArea);
  const dayFilteredDeals = deals.filter((deal) => selectedDay === "All" || dealRunsOnPublicDay(deal, selectedDay));
  const dayAreaFilteredDeals = deals
    .filter((deal) => selectedDay === "All" || dealRunsOnPublicDay(deal, selectedDay))
    .filter((deal) => selectedArea === "All" || deal.areaGroup === selectedArea);
  const dayCounts = new Map(summarizePublicDealsByDay(areaFilteredDeals).map((item) => [item.day, item.count]));
  const areaCounts = new Map(summarizePublicDealsByArea(dayFilteredDeals).map((item) => [item.area, item.count]));
  const countForQuickFilter = (quickFilter: (typeof quickFilterOptions)[number]["value"]) =>
    dayAreaFilteredDeals.filter((deal) => matchesQuickFilter(deal, quickFilter)).length;
  const countForDay = (day: (typeof dayOptions)[number]) =>
    day === "All" ? areaFilteredDeals.length : dayCounts.get(day) ?? 0;
  const countForArea = (area: (typeof areaOptions)[number]) => {
    if (area === "All") {
      return dayFilteredDeals.length;
    }

    return areaCounts.get(area) ?? 0;
  };

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">All deals</p>
          <h1>Wilmington food specials</h1>
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

      <nav className="segmentedNav" aria-label="Filter deals by day">
        {dayOptions.map((day) => (
          <Link
            key={day}
            href={queryFor({ day, area: selectedArea, quick: selectedQuickFilter, sort: selectedSort }) as Route}
            className={day === selectedDay ? "active" : ""}
            aria-current={day === selectedDay ? "page" : undefined}
          >
            <span>{day}</span>
            <strong>{countForDay(day)}</strong>
          </Link>
        ))}
      </nav>

      <section className="filterPanel" aria-label="Area, quick filter, and sort controls">
        <div>
          <p className="eyebrow">Area</p>
          <nav className="segmentedNav compactFilters" aria-label="Filter deals by area">
            {areaOptions.map((area) => (
              <Link
                key={area}
                href={queryFor({ day: selectedDay, area, quick: selectedQuickFilter, sort: selectedSort }) as Route}
                className={area === selectedArea ? "active" : ""}
                aria-current={area === selectedArea ? "page" : undefined}
              >
                <span>{area}</span>
                <strong>{countForArea(area)}</strong>
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="eyebrow">Quick filter</p>
          <nav className="segmentedNav compactFilters" aria-label="Quick filter deals">
            {quickFilterOptions.map((option) => (
              <Link
                key={option.value}
                href={queryFor({ day: selectedDay, area: selectedArea, quick: option.value, sort: selectedSort }) as Route}
                className={option.value === selectedQuickFilter ? "active" : ""}
                aria-current={option.value === selectedQuickFilter ? "page" : undefined}
              >
                <span>{option.label}</span>
                <strong>{countForQuickFilter(option.value)}</strong>
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="eyebrow">Sort</p>
          <nav className="segmentedNav compactFilters" aria-label="Sort deals">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={queryFor({ day: selectedDay, area: selectedArea, quick: selectedQuickFilter, sort: option.value }) as Route}
                className={option.value === selectedSort ? "active" : ""}
                aria-current={option.value === selectedSort ? "page" : undefined}
              >
                <span>{option.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {visibleDeals.length === 0 ? (
        <section className="emptyState" aria-label="No deals for selected day">
          <p className="eyebrow">No matches yet</p>
          <h2>No specials match this view yet.</h2>
          <p>
            Try another day, area, or quick filter.
          </p>
          <div className="cardActions">
            <Link href="/deals" className="primaryLink">
              All deals
            </Link>
            <Link href="/tonight" className="secondaryLink">
              Today
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
                  <h2>Day-specific specials</h2>
                </div>
                <span className="countPill">{singleDayDeals.length}</span>
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
