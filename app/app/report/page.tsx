import Link from "next/link";
import type { Route } from "next";
import { getPublicDealById, getRestaurantById } from "../../lib/data";
import { ReportForm } from "./report-form";

type ReportPageProps = {
  searchParams?: Promise<{
    dealId?: string;
    restaurantId?: string;
  }>;
};

function reportIntakeAvailable() {
  return Boolean(
    (process.env.HUBSPOT_PORTAL_ID && process.env.HUBSPOT_INTAKE_FORM_GUID) ||
    process.env.REPORT_WEBHOOK_URL ||
    process.env.NODE_ENV !== "production"
  );
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const params = await searchParams;
  const [deal, restaurantFromParam] = await Promise.all([
    params?.dealId ? getPublicDealById(params.dealId) : Promise.resolve(undefined),
    params?.restaurantId ? getRestaurantById(params.restaurantId) : Promise.resolve(undefined)
  ]);
  const restaurant = restaurantFromParam ?? (deal ? await getRestaurantById(deal.restaurantId) : undefined);
  const contextLabel = deal?.publicTitle ?? restaurant?.name ?? "general Wilmington report";
  const contextPath = deal
    ? `/deals/${deal.dealId}`
    : restaurant
      ? `/restaurants/${restaurant.restaurantId}`
      : "";
  const contextType = deal ? "deal" : restaurant ? "restaurant" : "general";
  const intakeAvailable = reportIntakeAvailable();
  const emergencyEmail = process.env.NEXT_PUBLIC_REPORT_EMAIL;

  return (
    <main className="pageShell detailShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Send an update</p>
          <h1>Share a Forkcast update</h1>
          <p>
            Spotted a change, missing restaurant, or special worth adding?
            Send it our way.
          </p>
          {!intakeAvailable ? (
            <p className="notes">
              This form is not connected yet. Please check back later.
              {emergencyEmail ? (
                <>
                  {" "}For now, email{" "}
                  <a href={`mailto:${emergencyEmail}`}>{emergencyEmail}</a>.
                </>
              ) : null}
            </p>
          ) : null}
        </div>
        <Link href="/deals" className="secondaryLink">
          All deals
        </Link>
      </section>

      <section className="detailGrid">
        <article className="detailPanel">
          <h2>What you&apos;re updating</h2>
          <dl className="factGrid">
            <div>
              <dt>Item</dt>
              <dd>{contextLabel}</dd>
            </div>
            <div>
              <dt>Restaurant</dt>
              <dd>{restaurant?.name ?? deal?.restaurantName ?? "Not specified"}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{deal ? "Deal" : restaurant ? "Restaurant" : "General report"}</dd>
            </div>
            <div>
              <dt>Next step</dt>
              <dd>Thanks. This will be reviewed before anything changes on the site.</dd>
            </div>
          </dl>
        </article>

        <article className="detailPanel">
          <h2>Send update</h2>
          <ReportForm
            contextLabel={contextLabel}
            contextPath={contextPath}
            contextType={contextType}
            dealId={deal?.dealId}
            dealTitle={deal?.publicTitle}
            intakeAvailable={intakeAvailable}
            restaurantName={restaurant?.name ?? deal?.restaurantName}
            restaurantId={restaurant?.restaurantId}
          />
          <div className="cardActions">
            {contextPath ? (
              <Link href={contextPath as Route} className="secondaryLink">
                Back to context
              </Link>
            ) : (
              <Link href="/deals" className="secondaryLink">
                All deals
              </Link>
          )}
          </div>
        </article>
      </section>
    </main>
  );
}
