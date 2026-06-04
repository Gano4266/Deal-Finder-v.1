import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getRestaurantById, getRestaurants } from "../../../lib/data";
import { phoneHref } from "../../phone-link";

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
              ? `${restaurant.publicDealCount} food special${restaurant.publicDealCount === 1 ? "" : "s"} listed.`
              : "No food specials are ready for this restaurant yet."}
          </p>
          <p className="notes">
            Details can change. Check the restaurant&apos;s latest post or site
            before you order.
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
              <dd>{restaurant.address || "Not listed"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                {phoneHref(restaurant.phone) ? (
                  <a href={phoneHref(restaurant.phone)}>{restaurant.phone}</a>
                ) : (
                  "Not listed"
                )}
              </dd>
            </div>
            <div>
              <dt>Cuisine</dt>
              <dd>{restaurant.cuisine || restaurant.tags || "Not listed"}</dd>
            </div>
            <div>
              <dt>Checked</dt>
              <dd>{restaurant.lastChecked || "Not listed"}</dd>
            </div>
          </dl>
          <div className="cardActions">
            {phoneHref(restaurant.phone) ? (
              <a href={phoneHref(restaurant.phone)} className="primaryLink">
                Call restaurant
              </a>
            ) : null}
            {restaurant.website ? (
              <a href={restaurant.website} className={phoneHref(restaurant.phone) ? "secondaryLink" : "primaryLink"}>
                Official site
              </a>
            ) : null}
            <Link href={`/report?restaurantId=${restaurant.restaurantId}` as Route} className="secondaryLink">
              Report an issue
            </Link>
            <Link href={"/report?type=owner_feedback" as Route} className="secondaryLink">
              Feedback to owner
            </Link>
          </div>
        </article>

        <article className="detailPanel">
          <h2>Specials</h2>
          {restaurant.deals.length === 0 ? (
            <p className="notes">
              No current specials are listed for this restaurant yet.
            </p>
          ) : (
            <div className="miniDealList">
              {restaurant.deals.map((deal) => (
                <Link key={deal.dealId} href={`/deals/${deal.dealId}`} className="miniDeal">
                  <span>{deal.publicTitle}</span>
                  <small>{deal.scheduleLabel} / {deal.timeWindow}</small>
                </Link>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
