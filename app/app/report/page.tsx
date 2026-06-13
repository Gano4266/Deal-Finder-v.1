import Link from "next/link";
import type { Route } from "next";
import { getPublicDealById, getRestaurantById } from "../../lib/data";
import { ReportForm } from "./report-form";

type ReportPageProps = {
  searchParams?: Promise<{
    dealId?: string;
    restaurantId?: string;
    type?: string;
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
  const initialSubmissionType = params?.type === "owner_feedback"
    ? "owner_feedback"
    : params?.type === "confirm_in_person" && deal
      ? "confirm_in_person"
      : "report_issue";
  const ownerFeedbackMode = initialSubmissionType === "owner_feedback";
  const intakeAvailable = reportIntakeAvailable();
  const emergencyEmail = process.env.NEXT_PUBLIC_REPORT_EMAIL;

  return (
    <main className="pageShell detailShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">{ownerFeedbackMode ? "Owner feedback" : "Send an update"}</p>
          <h1>{ownerFeedbackMode ? "Submit feedback to owner" : "Share a Forkcast update"}</h1>
          <p>
            {ownerFeedbackMode
              ? "Have a thought about Forkcast itself? Send it directly to the owner queue."
              : "Spotted a change, missing restaurant, or special worth adding? Send it our way."}
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

      <section className="detailGrid reportGrid">
        <article className="detailPanel reportContextPanel">
          <h2>What you&apos;re updating</h2>
          <dl className="factGrid">
            <div>
              <dt>Item</dt>
              <dd>{ownerFeedbackMode ? "Forkcast owner feedback" : contextLabel}</dd>
            </div>
            <div>
              <dt>Restaurant</dt>
              <dd>{ownerFeedbackMode ? "Not item-specific" : restaurant?.name ?? deal?.restaurantName ?? "Not specified"}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{ownerFeedbackMode ? "Owner feedback" : deal ? "Deal" : restaurant ? "Restaurant" : "General report"}</dd>
            </div>
            <div>
              <dt>Next step</dt>
              <dd>Thanks. This will be reviewed before anything changes on the site.</dd>
            </div>
          </dl>
          {!ownerFeedbackMode ? (
            <div className="cardActions">
              <Link href={"/report?type=owner_feedback" as Route} className="secondaryLink">
                Submit feedback to owner
              </Link>
            </div>
          ) : null}
        </article>

        <article className="detailPanel reportFormPanel">
          <h2>Send update</h2>
          <ReportForm
            contextLabel={contextLabel}
            contextPath={contextPath}
            contextType={contextType}
            dealId={deal?.dealId}
            dealTitle={deal?.publicTitle}
            initialSubmissionType={initialSubmissionType}
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
