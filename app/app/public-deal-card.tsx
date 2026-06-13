import Link from "next/link";
import type { Route } from "next";
import type { PublicDeal } from "../lib/data";
import { displayDescription, displayRestaurantName } from "./public-copy";
import { QuickConfirmButton } from "./quick-confirm-button";

type PublicDealCardProps = {
  deal: PublicDeal;
  confirmContextPath?: string;
  detailHref?: Route | null;
  variant?: "standard" | "compact" | "secondary";
};

export function PublicDealCard({
  deal,
  confirmContextPath,
  detailHref,
  variant = "standard"
}: PublicDealCardProps) {
  const isCompact = variant !== "standard";
  const isSecondary = variant === "secondary";
  const resolvedDetailHref = detailHref === undefined ? (`/deals/${deal.dealId}` as Route) : detailHref;
  const resolvedConfirmContextPath = confirmContextPath ?? `/deals/${deal.dealId}`;
  const description = displayDescription(deal.publicDescription);
  const restaurantName = displayRestaurantName(deal.restaurantName);
  const contextLabel = isCompact ? "Day" : "Area";
  const contextValue = isCompact ? deal.scheduleLabel : deal.area || deal.areaGroup;
  const hasTimeCaveat = deal.timeWindow === "N/A";
  const className = [
    "dealCard",
    isCompact ? "compactDealCard" : "",
    isSecondary ? "secondaryDealCard" : ""
  ].filter(Boolean).join(" ");

  return (
    <article className={className}>
      {resolvedDetailHref ? (
        <Link
          href={resolvedDetailHref}
          className="dealCardPrimaryLink"
          aria-label={`View details for ${deal.publicTitle} at ${deal.restaurantName}`}
        />
      ) : null}
      <div className="dealMain">
        <p className="restaurantLine">
          <span>{restaurantName}</span>
        </p>
        <h2>{deal.publicTitle}</h2>
        <div className="badgeRow" aria-label="Details">
          <span>{deal.scheduleLabel}</span>
          <span>{isCompact ? deal.area : deal.areaGroup}</span>
          {isCompact && deal.area !== deal.areaGroup ? <span>{deal.areaGroup}</span> : null}
          {hasTimeCaveat ? <span className="warnBadge">Time not listed</span> : null}
          {isSecondary ? <span>Checked {deal.lastVerifiedLabel}</span> : null}
        </div>
        {description ? <p className="dealCopy">{description}</p> : null}
        <p className="locationLine">{isCompact ? deal.area : deal.neighborhood || deal.address}</p>
      </div>
      <dl className={`factGrid dealMetricGrid ${isCompact ? "compactFactGrid" : ""}`}>
        <div>
          <dt>Price</dt>
          <dd>{deal.price || "See details"}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{deal.timeWindow}</dd>
        </div>
        <div>
          <dt>{contextLabel}</dt>
          <dd>{contextValue}</dd>
        </div>
        <div>
          <dt>Checked</dt>
          <dd>{deal.lastVerifiedLabel}</dd>
        </div>
      </dl>
      <div className="cardActions dealActionRail">
        <a href={deal.sourceUrl} className="secondaryLink">
          Official source
        </a>
        <QuickConfirmButton
          contextPath={resolvedConfirmContextPath}
          dealId={deal.dealId}
          dealTitle={deal.publicTitle}
          restaurantId={deal.restaurantId}
          restaurantName={deal.restaurantName}
        />
        {!isSecondary ? (
          <Link href={`/report?dealId=${deal.dealId}` as Route} className="secondaryLink">
            Report an issue
          </Link>
        ) : null}
      </div>
    </article>
  );
}
