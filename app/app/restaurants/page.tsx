import Link from "next/link";
import type { Route } from "next";
import { getRestaurants } from "../../lib/data";
import { phoneHref } from "../phone-link";

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();
  const withDeals = restaurants.filter((restaurant) => restaurant.publicDealCount > 0);
  const sourceOnly = restaurants.filter((restaurant) => restaurant.publicDealCount === 0);

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Restaurant coverage</p>
          <h1>Wilmington restaurants</h1>
          <p>
            Browse Wilmington restaurants Forkcast is tracking for food
            specials.
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
          <strong>{restaurants.length}</strong>
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

      <section className="restaurantList" aria-label="Restaurants with deals">
        {withDeals.map((restaurant) => (
          <article key={restaurant.restaurantId} className="restaurantCard">
            <div>
              <p className="eyebrow">{restaurant.neighborhood || "Wilmington"}</p>
              <h2>{restaurant.name}</h2>
              <div className="badgeRow" aria-label="Restaurant status">
                <span>{restaurant.publicDealCount} deal{restaurant.publicDealCount === 1 ? "" : "s"}</span>
                <span>Last confirmed {restaurant.lastChecked}</span>
                {restaurant.publicDealDays.length > 0 ? (
                  <span>{restaurant.publicDealDays.join(" / ")}</span>
                ) : null}
              </div>
              <p>{restaurant.cuisine || restaurant.tags || "Wilmington restaurant in the pilot set."}</p>
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

      <section className="restaurantList compactList" aria-label="Restaurants without deals yet">
        <h2>On our radar</h2>
        {sourceOnly.map((restaurant) => (
          <article key={restaurant.restaurantId} className="restaurantCard compactRestaurantCard">
            <div>
              <h3>{restaurant.name}</h3>
              <p>{restaurant.neighborhood || "Wilmington"} / last confirmed {restaurant.lastChecked}</p>
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
    </main>
  );
}
