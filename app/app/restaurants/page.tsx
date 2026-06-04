import Link from "next/link";
import type { Route } from "next";
import { SearchForm } from "../search-form";
import { matchesSearchQuery, normalizeSearchQuery } from "../../lib/public-search";
import { getRestaurants, publicAreaGroupOptions } from "../../lib/data";
import { phoneHref } from "../phone-link";

type RestaurantsPageProps = {
  searchParams?: Promise<{
    area?: string;
    q?: string;
  }>;
};

function queryFor(area: string, q: string) {
  const query = new URLSearchParams();

  if (area !== "All") {
    query.set("area", area);
  }

  if (q) {
    query.set("q", q);
  }

  const queryText = query.toString();
  return queryText ? `/restaurants?${queryText}` : "/restaurants";
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const params = await searchParams;
  const selectedSearchQuery = normalizeSearchQuery(params?.q);
  const restaurants = await getRestaurants();
  const areaOptions = ["All", ...publicAreaGroupOptions] as const;
  const selectedArea = areaOptions.includes((params?.area ?? "All") as (typeof areaOptions)[number])
    ? params?.area ?? "All"
    : "All";
  const visibleRestaurants = restaurants.filter(
    (restaurant) => selectedArea === "All" || restaurant.areaGroup === selectedArea
  ).filter((restaurant) => matchesSearchQuery([
    restaurant.name,
    restaurant.neighborhood,
    restaurant.areaGroup,
    restaurant.address,
    restaurant.cuisine,
    restaurant.tags,
    restaurant.publicDealDays.join(" ")
  ], selectedSearchQuery));
  const withDeals = visibleRestaurants.filter((restaurant) => restaurant.publicDealCount > 0);
  const sourceOnly = visibleRestaurants.filter((restaurant) => restaurant.publicDealCount === 0);
  const searchFilteredRestaurants = restaurants.filter((restaurant) => matchesSearchQuery([
    restaurant.name,
    restaurant.neighborhood,
    restaurant.areaGroup,
    restaurant.address,
    restaurant.cuisine,
    restaurant.tags,
    restaurant.publicDealDays.join(" ")
  ], selectedSearchQuery));
  const emptyHeading = selectedSearchQuery
    ? `No restaurants match "${selectedSearchQuery}" yet.`
    : selectedArea === "All"
    ? "No restaurants match this area yet."
    : `No ${selectedArea} restaurants match this area yet.`;
  const emptyCopy = selectedSearchQuery
    ? "Try another search or area."
    : selectedArea === "All"
    ? "Try another area while Forkcast keeps expanding coverage."
    : "Try another area or check back as the local read fills in.";
  const countForArea = (area: (typeof areaOptions)[number]) => {
    if (area === "All") {
      return searchFilteredRestaurants.length;
    }

    return searchFilteredRestaurants.filter((restaurant) => restaurant.areaGroup === area).length;
  };

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Restaurant coverage</p>
          <h1>Restaurants Forkcast is watching</h1>
          <p>
            Browse restaurants Forkcast is tracking for food specials across
            the local coverage area.
          </p>
          <p className="notes">
            Details can change. Check the restaurant&apos;s latest post or site
            before you order.
          </p>
        </div>
        <Link href="/deals" className="secondaryLink">
          Deals
        </Link>
      </section>

      <section className="summaryStrip" aria-label="Restaurant coverage summary">
        <div>
          <span className="statusLabel">Restaurants</span>
          <strong>{visibleRestaurants.length}</strong>
        </div>
        <div>
          <span className="statusLabel">With deals</span>
          <strong>{withDeals.length}</strong>
        </div>
        <div>
          <span className="statusLabel">No deals yet</span>
          <strong>{sourceOnly.length}</strong>
        </div>
      </section>

      <SearchForm
        action="/restaurants"
        clearHref={queryFor(selectedArea, "")}
        hiddenFields={[
          selectedArea !== "All" ? { name: "area", value: selectedArea } : undefined
        ].filter((field): field is { name: string; value: string } => Boolean(field))}
        label="Search restaurants"
        placeholder="Try tacos, pizza, seafood, K38..."
        query={selectedSearchQuery}
      />

      <nav className="segmentedNav compactFilters" aria-label="Filter restaurants by area">
        {areaOptions.map((area) => (
          <Link
            key={area}
            href={queryFor(area, selectedSearchQuery) as Route}
            className={area === selectedArea ? "active" : ""}
            aria-current={area === selectedArea ? "page" : undefined}
          >
            <span>{area}</span>
            <strong>{countForArea(area)}</strong>
          </Link>
        ))}
      </nav>

      <section className="restaurantList" aria-label="Restaurants with deals">
        {withDeals.map((restaurant) => (
          <article key={restaurant.restaurantId} className="restaurantCard">
            <div>
              <p className="eyebrow">{restaurant.neighborhood || "Wilmington"}</p>
              <h2>{restaurant.name}</h2>
              <div className="badgeRow" aria-label="Restaurant status">
                <span>{restaurant.publicDealCount} deal{restaurant.publicDealCount === 1 ? "" : "s"}</span>
                <span>Checked {restaurant.lastChecked}</span>
                {restaurant.publicDealDays.length > 0 ? (
                  <span>{restaurant.publicDealDays.join(" / ")}</span>
                ) : null}
              </div>
              <p>{restaurant.cuisine || restaurant.tags || "Restaurant in the Forkcast set."}</p>
              <p className="locationLine">{restaurant.address}</p>
            </div>
            <div className="cardActions">
              <Link href={`/restaurants/${restaurant.restaurantId}` as Route} className="primaryLink">
                View restaurant
              </Link>
              {phoneHref(restaurant.phone) ? (
                <a href={phoneHref(restaurant.phone)} className="secondaryLink">
                  Call
                </a>
              ) : null}
              {restaurant.website ? (
                <a href={restaurant.website} className="secondaryLink">
                  Official site
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      {visibleRestaurants.length === 0 ? (
        <section className="emptyState" aria-label="No restaurants for selected area">
          <p className="eyebrow">No matches yet</p>
          <h2>{emptyHeading}</h2>
          <p>{emptyCopy}</p>
        </section>
      ) : (
        <section className="restaurantList compactList" aria-label="Restaurants without deals yet">
          <h2>On our radar</h2>
          {sourceOnly.map((restaurant) => (
            <article key={restaurant.restaurantId} className="restaurantCard compactRestaurantCard">
              <div>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.neighborhood || "Wilmington"} / checked {restaurant.lastChecked}</p>
              </div>
              <div className="cardActions">
                {phoneHref(restaurant.phone) ? (
                  <a href={phoneHref(restaurant.phone)} className="secondaryLink">
                    Call
                  </a>
                ) : null}
                <Link href={`/restaurants/${restaurant.restaurantId}` as Route} className="secondaryLink">
                  Details
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
