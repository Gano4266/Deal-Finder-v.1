import Link from "next/link";
import type { Route } from "next";
import { getRestaurants, publicAreaGroupOptions } from "../../lib/data";
import { phoneHref } from "../phone-link";

type RestaurantsPageProps = {
  searchParams?: Promise<{
    area?: string;
  }>;
};

function queryFor(area: string) {
  const query = new URLSearchParams();

  if (area !== "All") {
    query.set("area", area);
  }

  const queryText = query.toString();
  return queryText ? `/restaurants?${queryText}` : "/restaurants";
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const params = await searchParams;
  const restaurants = await getRestaurants();
  const areaOptions = ["All", ...publicAreaGroupOptions] as const;
  const selectedArea = areaOptions.includes((params?.area ?? "All") as (typeof areaOptions)[number])
    ? params?.area ?? "All"
    : "All";
  const visibleRestaurants = restaurants.filter(
    (restaurant) => selectedArea === "All" || restaurant.areaGroup === selectedArea
  );
  const withDeals = visibleRestaurants.filter((restaurant) => restaurant.publicDealCount > 0);
  const sourceOnly = visibleRestaurants.filter((restaurant) => restaurant.publicDealCount === 0);
  const emptyHeading = selectedArea === "All"
    ? "No restaurants match this area yet."
    : `No ${selectedArea} restaurants match this area yet.`;
  const emptyCopy = selectedArea === "All"
    ? "Try another area while Forkcast keeps expanding coverage."
    : "Try another area or check back as the local read fills in.";
  const countForArea = (area: (typeof areaOptions)[number]) => {
    if (area === "All") {
      return restaurants.length;
    }

    return restaurants.filter((restaurant) => restaurant.areaGroup === area).length;
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

      <nav className="segmentedNav compactFilters" aria-label="Filter restaurants by area">
        {areaOptions.map((area) => (
          <Link
            key={area}
            href={queryFor(area) as Route}
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
