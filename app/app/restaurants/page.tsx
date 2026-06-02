import Link from "next/link";
import type { Route } from "next";
import { getRestaurants } from "../../lib/data";

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();
  const withDeals = restaurants.filter((restaurant) => restaurant.publicDealCount > 0);
  const sourceOnly = restaurants.filter((restaurant) => restaurant.publicDealCount === 0);

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Wilmington seed market</p>
          <h1>Restaurants being tracked</h1>
          <p>
            Browse the Wilmington restaurant set behind the static prototype.
            Deal counts include only reviewed public food-special rows.
          </p>
          <p className="notes">
            Static prototype data, not live availability. Restaurants without
            reviewed deals may still have source or review work in progress.
          </p>
        </div>
        <Link href="/deals" className="secondaryLink">
          Deals
        </Link>
      </section>

      <section className="summaryStrip" aria-label="Restaurant coverage summary">
        <div>
          <span className="statusLabel">Tracked restaurants</span>
          <strong>{restaurants.length}</strong>
        </div>
        <div>
          <span className="statusLabel">With reviewed deals</span>
          <strong>{withDeals.length}</strong>
        </div>
        <div>
          <span className="statusLabel">Source-only so far</span>
          <strong>{sourceOnly.length}</strong>
        </div>
      </section>

      <section className="restaurantList" aria-label="Restaurants with reviewed deals">
        {withDeals.map((restaurant) => (
          <article key={restaurant.restaurantId} className="restaurantCard">
            <div>
              <p className="eyebrow">{restaurant.neighborhood || "Wilmington"}</p>
              <h2>{restaurant.name}</h2>
              <div className="badgeRow" aria-label="Restaurant status">
                <span>{restaurant.publicDealCount} reviewed deal{restaurant.publicDealCount === 1 ? "" : "s"}</span>
                <span>Checked {restaurant.lastChecked}</span>
                {restaurant.publicDealDays.length > 0 ? (
                  <span>{restaurant.publicDealDays.join(" / ")}</span>
                ) : null}
              </div>
              <p>{restaurant.cuisine || restaurant.tags || "Restaurant source tracked for Wilmington."}</p>
              <p className="locationLine">{restaurant.address}</p>
            </div>
            <div className="cardActions">
              <Link href={`/restaurants/${restaurant.restaurantId}` as Route} className="primaryLink">
                View restaurant
              </Link>
              {restaurant.website ? (
                <a href={restaurant.website} className="secondaryLink">
                  Source
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <section className="restaurantList compactList" aria-label="Tracked restaurants without public deals">
        <h2>Source-only restaurants</h2>
        {sourceOnly.map((restaurant) => (
          <article key={restaurant.restaurantId} className="restaurantCard compactRestaurantCard">
            <div>
              <h3>{restaurant.name}</h3>
              <p>{restaurant.neighborhood || "Wilmington"} / checked {restaurant.lastChecked}</p>
            </div>
            <Link href={`/restaurants/${restaurant.restaurantId}` as Route} className="secondaryLink">
              Details
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
