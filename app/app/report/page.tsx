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
  return `Deal Finder report: ${contextLabel}`;
}

function reportBody(contextLabel: string, contextUrl: string): string {
  const lines = [
    `Deal/restaurant: ${contextLabel}`,
    ...(contextUrl ? [`Page: ${contextUrl}`] : []),
    "",
    "Issue:",
    "",
    "Correct info or source:",
    "",
    "Your name/contact, optional:"
  ];

  return lines.join("\n");
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
            Send a quick correction if a deal looks stale, wrong, or missing a
            source detail.
          </p>
          <p className="notes">
            Reports open an email draft. Nothing publishes automatically.
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
              <dd>{reportEmail ? "Email operator for review" : "Use fallback template"}</dd>
            </div>
          </dl>
        </article>

        <article className="detailPanel">
          <h2>What to include</h2>
          <div className="reportChecklist">
            <p>What looks wrong</p>
            <p>The correct deal info, if you know it</p>
            <p>A source link or restaurant confirmation</p>
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
