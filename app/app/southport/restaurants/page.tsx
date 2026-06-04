import Link from "next/link";
import { SearchForm } from "../../search-form";
import { getSouthportRestaurants } from "../../../lib/data";
import { matchesSearchQuery, normalizeSearchQuery } from "../../../lib/public-search";
import { phoneHref } from "../../phone-link";

export const dynamic = "force-dynamic";

type SouthportRestaurantsPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

function queryFor(q: string) {
  const query = new URLSearchParams();

  if (q) {
    query.set("q", q);
  }

  const queryText = query.toString();
  return queryText ? `/southport/restaurants?${queryText}` : "/southport/restaurants";
}

export default async function SouthportRestaurantsPage({ searchParams }: SouthportRestaurantsPageProps) {
  const params = await searchParams;
  const selectedSearchQuery = normalizeSearchQuery(params?.q);
  const restaurants = await getSouthportRestaurants();
  const visibleRestaurants = restaurants.filter((restaurant) => matchesSearchQuery([
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

  return (
    <main className="pageShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Southport preview</p>
          <h1>Southport restaurants</h1>
          <p>
            Restaurants in the separate Southport soft pilot, with reviewed
            food specials where Forkcast has them.
          </p>
          <p className="notes">
            Southport stays separate from the main Wilmington restaurant list.
          </p>
        </div>
        <Link href="/southport/deals" className="secondaryLink">
          All Deals
        </Link>
      </section>

      <nav className="segmentedNav compactFilters" aria-label="Southport navigation">
        <Link href="/southport">
          <span>Today</span>
        </Link>
        <Link href="/southport/deals">
          <span>All Deals</span>
        </Link>
        <Link href="/southport/restaurants" className="active" aria-current="page">
          <span>Restaurants</span>
          <strong>{restaurants.length}</strong>
        </Link>
      </nav>

      <section className="summaryStrip" aria-label="Southport restaurant coverage summary">
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
        action="/southport/restaurants"
        clearHref={queryFor("")}
        label="Search Southport restaurants"
        placeholder="Try seafood, lunch, Oak Island..."
        query={selectedSearchQuery}
      />

      {visibleRestaurants.length === 0 ? (
        <section className="emptyState" aria-label="No Southport restaurants yet">
          <p className="eyebrow">No matches yet</p>
          <h2>
            {selectedSearchQuery
              ? `No Southport restaurants match "${selectedSearchQuery}" yet.`
              : "No Southport restaurants are ready yet."}
          </h2>
          <p>
            Try another search while Forkcast keeps building the Southport read.
          </p>
        </section>
      ) : (
        <>
          <section className="restaurantList" aria-label="Southport restaurants with deals">
            {withDeals.map((restaurant) => (
              <article key={restaurant.restaurantId} className="restaurantCard">
                <div>
                  <p className="eyebrow">{restaurant.neighborhood || "Southport"}</p>
                  <h2>{restaurant.name}</h2>
                  <div className="badgeRow" aria-label="Restaurant status">
                    <span>{restaurant.publicDealCount} deal{restaurant.publicDealCount === 1 ? "" : "s"}</span>
                    {restaurant.publicDealDays.length > 0 ? (
                      <span>{restaurant.publicDealDays.join(" / ")}</span>
                    ) : null}
                  </div>
                  <p>{restaurant.cuisine || restaurant.tags || "Restaurant in the Southport preview."}</p>
                  <p className="locationLine">{restaurant.address}</p>
                </div>
                <div className="cardActions">
                  <Link href="/southport/deals" className="primaryLink">
                    View Southport deals
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

          {sourceOnly.length > 0 ? (
            <section className="restaurantList compactList" aria-label="Southport restaurants without deals yet">
              <h2>On our radar</h2>
              {sourceOnly.map((restaurant) => (
                <article key={restaurant.restaurantId} className="restaurantCard compactRestaurantCard">
                  <div>
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.neighborhood || "Southport"} / updated {restaurant.lastChecked}</p>
                  </div>
                  <div className="cardActions">
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
          ) : null}
        </>
      )}
    </main>
  );
}
