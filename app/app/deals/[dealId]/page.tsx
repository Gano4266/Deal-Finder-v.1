import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getPublicDealById, getPublicDeals, getRestaurantById } from "../../../lib/data";
import { phoneHref } from "../../phone-link";
import { displayDescription } from "../../public-copy";

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

  const restaurant = await getRestaurantById(deal.restaurantId);
  const restaurantPhoneHref = restaurant ? phoneHref(restaurant.phone) : undefined;
  const description = displayDescription(deal.publicDescription);

  return (
    <main className="pageShell detailShell">
      <section className="sectionHeader">
        <div>
          <p className="eyebrow">{deal.restaurantName}</p>
          <h1>{deal.publicTitle}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        <Link href="/deals" className="secondaryLink">
          All deals
        </Link>
      </section>

      <section className="detailGrid">
        <article className="detailPanel">
          <h2>Deal details</h2>
          <dl className="factGrid">
            <div>
              <dt>Price</dt>
              <dd>{deal.price || "See details"}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{deal.timeWindow}</dd>
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
          <p className="notes">
            {deal.restrictionNotes || "Check the restaurant source for any extra restrictions."}
          </p>
        </article>

        <article className="detailPanel">
          <h2>Official details</h2>
          <dl className="factGrid">
            <div>
              <dt>Restaurant post</dt>
              <dd>{deal.sourceDisplayName}</dd>
            </div>
            <div>
              <dt>Checked</dt>
              <dd>{deal.lastVerifiedLabel}</dd>
            </div>
            <div>
              <dt>Original wording</dt>
              <dd>{deal.sourceQuote ? "Shown below" : "Check the restaurant page"}</dd>
            </div>
          </dl>

          <section className="proofCard" aria-label="Restaurant source image and text">
            {deal.screenshotUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={deal.screenshotUrl}
                alt={`Restaurant source from ${deal.sourceDisplayName}`}
                className="proofPreview"
                fetchPriority="high"
                loading="eager"
                decoding="sync"
              />
            ) : (
              <div className="proofPlaceholder">No screenshot saved for this special.</div>
            )}
            <blockquote className="proofQuote">
              {deal.sourceQuote || "Check the restaurant page for the latest details."}
            </blockquote>
            <p className="proofCaption">Details checked {deal.lastVerifiedLabel}.</p>
          </section>

          <div className="cardActions">
            <a href={deal.sourceUrl} className="primaryLink">
              Check official details
            </a>
            <Link href={`/restaurants/${deal.restaurantId}` as Route} className="secondaryLink">
              View restaurant
            </Link>
            {restaurantPhoneHref ? (
              <a href={restaurantPhoneHref} className="secondaryLink">
                Call restaurant
              </a>
            ) : null}
            <Link href={`/report?dealId=${deal.dealId}` as Route} className="secondaryLink">
              Report an issue
            </Link>
            <Link href={"/report?type=owner_feedback" as Route} className="secondaryLink">
              Feedback to owner
            </Link>
          </div>
          <p className="notes">
            Details can change. Check the restaurant&apos;s latest post or site before you order.
          </p>
        </article>
      </section>
    </main>
  );
}
