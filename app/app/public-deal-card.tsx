import Link from "next/link";
import type { Route } from "next";
import type { PublicDeal } from "../lib/data";
import { displayDescription, displayRestaurantName } from "./public-copy";
import { ForecastConfidence } from "./forecast-confidence";
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

function sourceLabel(deal: PublicDeal): string {
  return deal.sourceTier.toLowerCase().includes("official")
    ? "Official source"
    : "Source checked";
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
        <p className="dealMetaLine" aria-label="Deal summary">
          <strong>{deal.price || "See details"}</strong>
          <span aria-hidden="true">·</span>
          <span>{timeLabel(deal)}</span>
          <span aria-hidden="true">·</span>
          <span>{contextValue}</span>
          {distanceLabel ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="distanceNote">{distanceLabel}</span>
            </>
          ) : null}
        </p>
        <div className="dealSignal">
          <ForecastConfidence
            lastVerifiedAt={deal.lastVerifiedAt}
            lastVerifiedLabel={deal.lastVerifiedLabel}
          />
          <a href={deal.sourceUrl} className="sourceLink">
            {sourceLabel(deal)}
          </a>
        </div>
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
