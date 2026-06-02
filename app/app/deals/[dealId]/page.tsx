import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getPublicDealById, getPublicDeals } from "../../../lib/data";

type DealPageProps = {
  params: Promise<{
    dealId: string;
  }>;
};

export async function generateStaticParams() {
  const deals = await getPublicDeals();
  return deals.map((deal) => ({ dealId: deal.dealId }));
}

export default async function DealDetailPage({ params }: DealPageProps) {
  const { dealId } = await params;
  const deal = await getPublicDealById(dealId);

  if (!deal) {
    notFound();
  }

  return (
    <main className="pageShell detailShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">{deal.restaurantName}</p>
          <h1>{deal.publicTitle}</h1>
          <p>{deal.publicDescription}</p>
        </div>
        <Link href="/tonight" className="secondaryLink">
          Tonight
        </Link>
      </section>

      <section className="detailGrid">
        <article className="detailPanel">
          <h2>Deal details</h2>
          <dl className="factGrid">
            <div>
              <dt>Price</dt>
              <dd>{deal.price || "See source"}</dd>
            </div>
            <div>
              <dt>When</dt>
              <dd>{deal.daysAvailableLabel} {deal.timeWindow}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{deal.neighborhood || "Wilmington"}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{deal.address}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>
                {[
                  deal.dineIn ? "Dine-in" : "",
                  deal.takeout ? "Takeout" : "",
                  deal.delivery ? "Delivery" : ""
                ].filter(Boolean).join(" / ") || "Not specified for this deal"}
              </dd>
            </div>
          </dl>
          <p className="notes">{deal.restrictionNotes || "Restrictions not fully captured."}</p>
        </article>

        <article className="detailPanel">
          <h2>Evidence</h2>
          <dl className="factGrid">
            <div>
              <dt>Evidence</dt>
              <dd>{deal.evidenceLabel}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>{deal.sourceDisplayName}</dd>
            </div>
            <div>
              <dt>Last checked</dt>
              <dd>{deal.lastVerifiedAt}</dd>
            </div>
            <div>
              <dt>Freshness</dt>
              <dd>{deal.freshnessLabel}</dd>
            </div>
          </dl>
          <div className="cardActions">
            <a href={deal.sourceUrl} className="primaryLink">
              Open official source
            </a>
            <Link href={`/report?dealId=${deal.dealId}` as Route} className="secondaryLink">
              Report issue
            </Link>
          </div>
          <p className="notes">{deal.prototypeNotice}</p>
        </article>
      </section>
    </main>
  );
}
