import Link from "next/link";
import type { Route } from "next";
import type { PublicDeal } from "../lib/data";
import { displayDescription, displayRestaurantName } from "./public-copy";
import { QuickConfirmButton } from "./quick-confirm-button";
import { getDealDistanceLabel } from "../lib/today-location";

type PublicDealCardProps = {
  deal: PublicDeal;
  confirmContextPath?: string;
  detailHref?: Route | null;
  selectedArea?: string;
  variant?: "standard" | "compact" | "secondary";
};

function timeLabel(deal: PublicDeal): string {
  return deal.timeWindow === "N/A" ? "Time not listed" : deal.timeWindow;
}

function trustLabel(deal: PublicDeal): string {
  const sourceLabel = deal.sourceTier.toLowerCase().includes("official")
    ? "Official source"
    : "Source checked";

  return `${sourceLabel} · Checked ${deal.lastVerifiedLabel}`;
}

export function PublicDealCard({
  deal,
  confirmContextPath,
  detailHref,
  selectedArea,
  variant = "standard"
}: PublicDealCardProps) {
  const isCompact = variant !== "standard";
  const isSecondary = variant === "secondary";
  const resolvedDetailHref = detailHref === undefined ? (`/deals/${deal.dealId}` as Route) : detailHref;
  const resolvedConfirmContextPath = confirmContextPath ?? `/deals/${deal.dealId}`;
  const description = displayDescription(deal.publicDescription);
  const restaurantName = displayRestaurantName(deal.restaurantName);
  const contextValue = isCompact ? deal.scheduleLabel : deal.area || deal.areaGroup;
  const distanceLabel = getDealDistanceLabel(deal, selectedArea);
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
        <div className="dealCardMetaBar" aria-label="Deal summary">
          <span>{deal.price || "See details"}</span>
          <span>{timeLabel(deal)}</span>
          <span>{contextValue}</span>
          {distanceLabel ? <span className="distanceBadge">{distanceLabel}</span> : null}
        </div>
        <p className="dealTrustLine">
          <a href={deal.sourceUrl} className="sourceLink">
            {trustLabel(deal)}
          </a>
        </p>
        {description ? <p className="dealCopy">{description}</p> : null}
        <p className="locationLine">{isCompact ? deal.area : deal.neighborhood || deal.address}</p>
      </div>
      <div className="cardActions dealActionRail">
        {resolvedDetailHref ? (
          <Link href={resolvedDetailHref} className="primaryLink dealDetailsLink">
            Details
          </Link>
        ) : null}
        <QuickConfirmButton
          contextPath={resolvedConfirmContextPath}
          dealId={deal.dealId}
          dealTitle={deal.publicTitle}
          restaurantId={deal.restaurantId}
          restaurantName={deal.restaurantName}
        />
        {!isSecondary ? (
          <Link href={`/report?dealId=${deal.dealId}` as Route} className="secondaryLink dealReportLink">
            Report an issue
          </Link>
        ) : null}
      </div>
    </article>
  );
}
