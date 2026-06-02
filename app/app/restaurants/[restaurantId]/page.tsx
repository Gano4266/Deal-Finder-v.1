import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getRestaurantById, getRestaurants } from "../../../lib/data";

type RestaurantPageProps = {
  params: Promise<{
    restaurantId: string;
  }>;
};

export async function generateStaticParams() {
  const restaurants = await getRestaurants();
  return restaurants.map((restaurant) => ({ restaurantId: restaurant.restaurantId }));
}

export default async function RestaurantDetailPage({ params }: RestaurantPageProps) {
  const { restaurantId } = await params;
  const restaurant = await getRestaurantById(restaurantId);

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="pageShell detailShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">{restaurant.neighborhood || "Wilmington"}</p>
          <h1>{restaurant.name}</h1>
          <p>
            {restaurant.publicDealCount > 0
              ? `${restaurant.publicDealCount} reviewed food-special row${restaurant.publicDealCount === 1 ? "" : "s"} in the static prototype.`
              : "No reviewed public food-special rows yet. This restaurant remains in the source/review backlog."}
          </p>
          <p className="notes">
            Static prototype data, not live availability. Confirm details with
            the listed official source before ordering.
          </p>
        </div>
        <Link href={"/restaurants" as Route} className="secondaryLink">
          Restaurants
        </Link>
      </section>

      <section className="detailGrid">
        <article className="detailPanel">
          <h2>Restaurant details</h2>
          <dl className="factGrid">
            <div>
              <dt>Area</dt>
              <dd>{restaurant.neighborhood || "Wilmington"}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{restaurant.address || "Address not captured"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{restaurant.phone || "Not captured"}</dd>
            </div>
            <div>
              <dt>Cuisine</dt>
              <dd>{restaurant.cuisine || restaurant.tags || "Not captured"}</dd>
            </div>
            <div>
              <dt>Last checked</dt>
              <dd>{restaurant.lastChecked || "Not captured"}</dd>
            </div>
          </dl>
          <div className="cardActions">
            {restaurant.website ? (
              <a href={restaurant.website} className="primaryLink">
                Official source
              </a>
            ) : null}
            <Link href={`/report?restaurantId=${restaurant.restaurantId}` as Route} className="secondaryLink">
              Report issue
            </Link>
          </div>
        </article>

        <article className="detailPanel">
          <h2>Reviewed deals</h2>
          {restaurant.deals.length === 0 ? (
            <p className="notes">
              No public deal rows are approved for this restaurant yet.
            </p>
          ) : (
            <div className="miniDealList">
              {restaurant.deals.map((deal) => (
                <Link key={deal.dealId} href={`/deals/${deal.dealId}`} className="miniDeal">
                  <span>{deal.publicTitle}</span>
                  <small>{deal.daysAvailableLabel} / {deal.timeWindow}</small>
                </Link>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
