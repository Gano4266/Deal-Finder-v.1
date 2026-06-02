import Link from "next/link";
import type { Route } from "next";
import {
  dealRunsOnPublicDay,
  getCarryoutPlaces,
  getPublicDeals,
  publicDealDayOptions,
  summarizePublicDealsByArea,
  summarizePublicDealsByDay
} from "../../lib/data";

type DealsPageProps = {
  searchParams?: Promise<{
    area?: string;
    day?: string;
    sort?: string;
  }>;
};

const sortOptions = [
  { value: "day", label: "Day" },
  { value: "area", label: "Area" },
  { value: "restaurant", label: "Restaurant" }
] as const;

function queryFor(params: { day: string; area: string; sort: string }) {
  const query = new URLSearchParams();

  if (params.day !== "All") {
    query.set("day", params.day);
  }

  if (params.area !== "All") {
    query.set("area", params.area);
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

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams;
  const dayOptions = ["All", ...publicDealDayOptions] as const;
  const selectedDay = dayOptions.includes((params?.day ?? "All") as (typeof dayOptions)[number])
    ? params?.day ?? "All"
    : "All";
  const selectedSort = sortOptions.some((option) => option.value === params?.sort) ? params?.sort ?? "area" : "area";
  const [deals, carryoutPlaces] = await Promise.all([
    getPublicDeals(),
    getCarryoutPlaces()
  ]);
  const dealAreaOptions = summarizePublicDealsByArea(deals).map((item) => item.area);
  const areaOptions = ["All", ...dealAreaOptions];
  if (!areaOptions.includes("Monkey Junction")) {
    areaOptions.push("Monkey Junction");
  }
  const selectedArea = areaOptions.includes(params?.area ?? "All")
    ? params?.area ?? "All"
    : "All";
  const visibleDeals = deals
    .filter((deal) => selectedDay === "All" || dealRunsOnPublicDay(deal, selectedDay))
    .filter((deal) => selectedArea === "All" || deal.area === selectedArea)
    .sort((left, right) => {
      if (selectedSort === "area") {
        return left.area.localeCompare(right.area) || left.restaurantName.localeCompare(right.restaurantName);
      }

      if (selectedSort === "restaurant") {
        return left.restaurantName.localeCompare(right.restaurantName) || left.publicTitle.localeCompare(right.publicTitle);
      }

      return firstDayRank(left.daysAvailable) - firstDayRank(right.daysAvailable) ||
        left.restaurantName.localeCompare(right.restaurantName);
    });
  const areaFilteredDeals = deals.filter((deal) => selectedArea === "All" || deal.area === selectedArea);
  const dayFilteredDeals = deals.filter((deal) => selectedDay === "All" || dealRunsOnPublicDay(deal, selectedDay));
  const dayCounts = new Map(summarizePublicDealsByDay(areaFilteredDeals).map((item) => [item.day, item.count]));
  const areaCounts = new Map(summarizePublicDealsByArea(dayFilteredDeals).map((item) => [item.area, item.count]));
  const countForDay = (day: (typeof dayOptions)[number]) =>
    day === "All" ? areaFilteredDeals.length : dayCounts.get(day) ?? 0;
  const countForArea = (area: string) => {
    if (area === "All") {
      return dayFilteredDeals.length;
    }

    const reviewedDealCount = areaCounts.get(area) ?? 0;
    if (area === "Monkey Junction" && reviewedDealCount === 0) {
      return carryoutPlaces.length;
    }

    return reviewedDealCount;
  };
  const showMonkeyJunctionLocations = selectedArea === "Monkey Junction";

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">All reviewed deals</p>
          <h1>Reviewed Wilmington food specials</h1>
          <p>
            Browse every source-backed prototype deal. `/tonight` only shows
            deals matching today&apos;s weekday.
          </p>
          <p className="notes">
            Static prototype data, not live availability. Confirm details with
            the listed official source before ordering.
          </p>
        </div>
        <Link href="/tonight" className="secondaryLink">
          Tonight
        </Link>
      </section>

      <nav className="segmentedNav" aria-label="Filter reviewed deals by day">
        {dayOptions.map((day) => (
          <Link
            key={day}
            href={queryFor({ day, area: selectedArea, sort: selectedSort }) as Route}
            className={day === selectedDay ? "active" : ""}
            aria-current={day === selectedDay ? "page" : undefined}
          >
            <span>{day}</span>
            <strong>{countForDay(day)}</strong>
          </Link>
        ))}
      </nav>

      <section className="filterPanel" aria-label="Area and sort controls">
        <div>
          <p className="eyebrow">Area</p>
          <nav className="segmentedNav compactFilters" aria-label="Filter reviewed deals by area">
            {areaOptions.map((area) => (
              <Link
                key={area}
                href={queryFor({ day: selectedDay, area, sort: selectedSort }) as Route}
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
          <p className="eyebrow">Sort</p>
          <nav className="segmentedNav compactFilters" aria-label="Sort reviewed deals">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={queryFor({ day: selectedDay, area: selectedArea, sort: option.value }) as Route}
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
        <section className="emptyState" aria-label="No reviewed deals for selected day">
          <p className="eyebrow">No reviewed deal rows</p>
          <h2>No reviewed deals match this filter yet.</h2>
          <p>
            The static inventory may still have reviewed deals on other days or
            areas. Monkey Junction currently has verified carryout locations,
            not reviewed public deal claims.
          </p>
          <div className="cardActions">
            <Link href="/deals" className="primaryLink">
              All reviewed deals
            </Link>
            <Link href="/tonight" className="secondaryLink">
              Tonight
            </Link>
          </div>
        </section>
      ) : (
        <section className="dealList" aria-label="All reviewed deals">
          {visibleDeals.map((deal) => (
            <article key={deal.dealId} className="dealCard compactDealCard">
              <div>
                <p className="eyebrow">{deal.daysAvailableLabel} / {deal.restaurantName}</p>
                <h2>{deal.publicTitle}</h2>
                <div className="badgeRow" aria-label="Deal verification">
                  <span>{deal.area}</span>
                  <span>{deal.evidenceLabel}</span>
                  <span>{deal.sourceDisplayName}</span>
                  <span>{deal.freshnessLabel}</span>
                  {deal.takeout ? <span>Takeout verified</span> : null}
                  {deal.delivery ? <span>Delivery verified</span> : null}
                </div>
                <p>{deal.publicDescription}</p>
              </div>
              <div className="cardActions">
                <Link href={`/deals/${deal.dealId}`} className="primaryLink">
                  Details
                </Link>
                <a href={deal.sourceUrl} className="secondaryLink">
                  Source
                </a>
                <Link href={`/report?dealId=${deal.dealId}` as Route} className="secondaryLink">
                  Report issue
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}

      {showMonkeyJunctionLocations ? (
        <section className="compactList" aria-label="Monkey Junction carryout locations">
          <div className="sectionTitleRow">
            <div>
              <p className="eyebrow">Monkey Junction locations</p>
              <h2>Verified carryout/place seeds</h2>
            </div>
            <Link href={"/carryout" as Route} className="secondaryLink">
              Carryout page
            </Link>
          </div>
          <p className="notes">
            These are official-source location records, not public deal claims.
            A Monkey Junction special still needs deal-specific evidence before
            it appears in the reviewed deal list.
          </p>
          <section className="dealList" aria-label="Monkey Junction locations">
            {carryoutPlaces.map((place) => (
              <article key={place.placeId} className="dealCard compactDealCard">
                <div>
                  <p className="eyebrow">{place.locationArea}</p>
                  <h2>{place.restaurantName}</h2>
                  <div className="badgeRow" aria-label="Location evidence">
                    <span>Official source</span>
                    <span>Carryout location</span>
                    {place.deliverySignal ? <span>Delivery signal</span> : null}
                  </div>
                  <p>{place.carryoutSignal}</p>
                  <p className="locationLine">{place.address}</p>
                </div>
                <div className="cardActions">
                  <a href={place.orderingUrl || place.sourceUrl} className="primaryLink">
                    Open source
                  </a>
                </div>
              </article>
            ))}
          </section>
        </section>
      ) : null}
    </main>
  );
}
