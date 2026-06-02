import Link from "next/link";
import type { Route } from "next";
import { getPublicDealById, getRestaurantById } from "../../lib/data";

type ReportPageProps = {
  searchParams?: Promise<{
    dealId?: string;
    restaurantId?: string;
  }>;
};

function reportSubject(contextLabel: string): string {
  return `Deal Finder correction: ${contextLabel}`;
}

function reportBody(contextLabel: string, contextUrl: string): string {
  return [
    `Context: ${contextLabel}`,
    contextUrl ? `App page: ${contextUrl}` : "",
    "",
    "What looks wrong?",
    "",
    "What source or restaurant confirmation should we check?",
    "",
    "Optional contact info if you want a follow-up:",
    "",
    "Do not include sensitive personal information."
  ].filter(Boolean).join("\n");
}

function mailtoHref(to: string, subject: string, body: string): string {
  const query = new URLSearchParams({
    subject,
    body
  });

  return `mailto:${to}?${query.toString()}`;
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const params = await searchParams;
  const [deal, restaurantFromParam] = await Promise.all([
    params?.dealId ? getPublicDealById(params.dealId) : Promise.resolve(undefined),
    params?.restaurantId ? getRestaurantById(params.restaurantId) : Promise.resolve(undefined)
  ]);
  const restaurant = restaurantFromParam ?? (deal ? await getRestaurantById(deal.restaurantId) : undefined);
  const contextLabel = deal?.publicTitle ?? restaurant?.name ?? "general Wilmington correction";
  const contextPath = deal
    ? `/deals/${deal.dealId}`
    : restaurant
      ? `/restaurants/${restaurant.restaurantId}`
      : "";
  const reportEmail = process.env.NEXT_PUBLIC_REPORT_EMAIL ?? "";
  const subject = reportSubject(contextLabel);
  const body = reportBody(contextLabel, contextPath);

  return (
    <main className="pageShell detailShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Correction intake</p>
          <h1>Report stale or incorrect deal info</h1>
          <p>
            Help keep the Wilmington prototype honest. Reports create review
            work for the operator; they never publish automatically.
          </p>
          <p className="notes">
            This static prototype does not store submissions in the app yet.
            Email reporting is not configured yet unless a reporting inbox is
            set for this deployment.
          </p>
        </div>
        <Link href="/tonight" className="secondaryLink">
          Tonight
        </Link>
      </section>

      <section className="detailGrid">
        <article className="detailPanel">
          <h2>Report context</h2>
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
              <dt>Source status</dt>
              <dd>{deal ? "Reviewed public deal" : restaurant ? "Tracked restaurant" : "General report"}</dd>
            </div>
            <div>
              <dt>Prototype action</dt>
              <dd>Open review task</dd>
            </div>
          </dl>
          <p className="notes">
            Credible restaurant corrections, source conflicts, and reports
            should route affected public deals to `needs_review` or
            `needs_recheck` until resolved.
          </p>
        </article>

        <article className="detailPanel">
          <h2>What to include</h2>
          <div className="reportChecklist">
            <p>What appears wrong or stale</p>
            <p>Where you saw the current information</p>
            <p>Whether you are the restaurant or a diner</p>
            <p>The official source or direct confirmation to check</p>
          </div>
          <div className="cardActions">
            {reportEmail ? (
              <a href={mailtoHref(reportEmail, subject, body)} className="primaryLink">
                Email correction
              </a>
            ) : (
              <span className="disabledLink">
                Reporting inbox not configured
              </span>
            )}
            {contextPath ? (
              <Link href={contextPath as Route} className="secondaryLink">
                Back to context
              </Link>
            ) : (
              <Link href="/deals" className="secondaryLink">
              Reviewed deals
            </Link>
          )}
          </div>
          <div className="copyBox" aria-label="Copyable correction template">
            <p className="eyebrow">Fallback template</p>
            <pre>{body}</pre>
          </div>
        </article>
      </section>
    </main>
  );
}
