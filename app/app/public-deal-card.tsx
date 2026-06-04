import Link from "next/link";
import type { Route } from "next";
import type { PublicDeal } from "../lib/data";
import { displayDescription } from "./public-copy";

type PublicDealCardProps = {
  deal: PublicDeal;
  variant?: "standard" | "compact" | "secondary";
};

export function PublicDealCard({ deal, variant = "standard" }: PublicDealCardProps) {
  const isCompact = variant !== "standard";
  const isSecondary = variant === "secondary";
  const description = displayDescription(deal.publicDescription);
  const className = [
    "dealCard",
    isCompact ? "compactDealCard" : "",
    isSecondary ? "secondaryDealCard" : ""
  ].filter(Boolean).join(" ");

  return (
    <article className={className}>
      <div>
        <p className="eyebrow">{deal.restaurantName}</p>
        <h2>{deal.publicTitle}</h2>
        <div className="badgeRow" aria-label="Details">
          <span>{deal.scheduleLabel}</span>
          <span>{isCompact ? deal.area : deal.areaGroup}</span>
          {isCompact && deal.area !== deal.areaGroup ? <span>{deal.areaGroup}</span> : null}
          {isSecondary ? <span>Checked {deal.lastVerifiedLabel}</span> : null}
        </div>
        {description ? <p>{description}</p> : null}
        <p className="locationLine">{isCompact ? deal.area : deal.neighborhood || deal.address}</p>
      </div>
      <dl className={`factGrid ${isCompact ? "compactFactGrid" : ""}`}>
        <div>
          <dt>Price</dt>
          <dd>{deal.price || "See details"}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{deal.timeWindow}</dd>
        </div>
        {!isSecondary ? (
          <div>
            <dt>Checked</dt>
            <dd>{deal.lastVerifiedLabel}</dd>
          </div>
        ) : null}
      </dl>
      <div className="cardActions">
        <Link href={`/deals/${deal.dealId}`} className={isSecondary ? "secondaryLink" : "primaryLink"}>
          Details
        </Link>
        <a href={deal.sourceUrl} className="secondaryLink">
          Check official details
        </a>
        {!isSecondary ? (
          <Link href={`/report?dealId=${deal.dealId}` as Route} className="secondaryLink">
            Report an issue
          </Link>
        ) : null}
      </div>
    </article>
  );
}
