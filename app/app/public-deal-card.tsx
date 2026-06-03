import Link from "next/link";
import type { Route } from "next";
import type { PublicDeal } from "../lib/data";

type PublicDealCardProps = {
  deal: PublicDeal;
  variant?: "standard" | "compact" | "secondary";
};

export function PublicDealCard({ deal, variant = "standard" }: PublicDealCardProps) {
  const isCompact = variant !== "standard";
  const isSecondary = variant === "secondary";
  const className = [
    "dealCard",
    isCompact ? "compactDealCard" : "",
    isSecondary ? "secondaryDealCard" : ""
  ].filter(Boolean).join(" ");

  return (
    <article className={className}>
      <div>
        <p className="eyebrow">
          {isCompact ? `${deal.daysAvailableLabel} / ${deal.restaurantName}` : deal.restaurantName}
        </p>
        <h2>{deal.publicTitle}</h2>
        <div className="badgeRow" aria-label="Deal details">
          <span>{deal.scheduleLabel}</span>
          <span>{isCompact ? deal.area : deal.areaGroup}</span>
          {isCompact && deal.area !== deal.areaGroup ? <span>{deal.areaGroup}</span> : null}
          {isSecondary ? <span>Last confirmed {deal.lastVerifiedAt}</span> : null}
        </div>
        <p>{deal.publicDescription}</p>
        <p className="locationLine">{isCompact ? deal.area : deal.neighborhood || deal.address}</p>
      </div>
      <dl className={`factGrid ${isCompact ? "compactFactGrid" : ""}`}>
        <div>
          <dt>Price</dt>
          <dd>{deal.price || "See source"}</dd>
        </div>
        <div>
          <dt>When</dt>
          <dd>{deal.daysAvailableLabel} {deal.timeWindow}</dd>
        </div>
        {!isSecondary ? (
          <div>
            <dt>Last confirmed</dt>
            <dd>{deal.lastVerifiedAt}</dd>
          </div>
        ) : null}
      </dl>
      <div className="cardActions">
        <Link href={`/deals/${deal.dealId}`} className={isSecondary ? "secondaryLink" : "primaryLink"}>
          Details
        </Link>
        <a href={deal.sourceUrl} className="secondaryLink">
          Restaurant source
        </a>
        {!isSecondary ? (
          <Link href={`/report?dealId=${deal.dealId}` as Route} className="secondaryLink">
            Send update
          </Link>
        ) : null}
      </div>
    </article>
  );
}
