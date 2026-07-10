import { getOperatingDate } from "../lib/data";

type ForecastConfidenceProps = {
  lastVerifiedAt: string;
  lastVerifiedLabel: string;
  variant?: "card" | "detail";
};

type ConfidenceTier = "high" | "medium" | "low" | "unknown";

function parseDateOnly(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if ([year, month, day].some(Number.isNaN)) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function wilmingtonToday(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(getOperatingDate());
  const valueFor = (type: string) => Number(parts.find((part) => part.type === type)?.value);

  return new Date(valueFor("year"), valueFor("month") - 1, valueFor("day"));
}

function daysSinceChecked(lastVerifiedAt: string): number | undefined {
  const checked = parseDateOnly(lastVerifiedAt);

  if (!checked) {
    return undefined;
  }

  const elapsed = wilmingtonToday().getTime() - checked.getTime();
  return Math.max(0, Math.round(elapsed / 86_400_000));
}

function tierForDays(days: number | undefined): ConfidenceTier {
  if (days === undefined) {
    return "unknown";
  }

  if (days <= 1) {
    return "high";
  }

  if (days <= 10) {
    return "medium";
  }

  return "low";
}

function chipLabel(tier: ConfidenceTier, days: number | undefined, lastVerifiedLabel: string): string {
  if (tier === "high") {
    return days === 0 ? "Verified today" : "Verified yesterday";
  }

  if (tier === "medium") {
    return `Checked ${lastVerifiedLabel}`;
  }

  if (tier === "low") {
    return `Checked ${lastVerifiedLabel} — verify first`;
  }

  return lastVerifiedLabel ? `Checked ${lastVerifiedLabel}` : "Check date not listed";
}

const detailNotes: Record<ConfidenceTier, string> = {
  high: "Fresh read. This special was confirmed against the restaurant's own source within the last day.",
  medium: "Recent read. Confirmed against the restaurant's own source, but details can still change.",
  low: "Older read. It has been a while since this was checked — verify with the restaurant before you go.",
  unknown: "No check date recorded. Verify with the restaurant before you go."
};

const tierNames: Record<ConfidenceTier, string> = {
  high: "high confidence",
  medium: "good confidence",
  low: "lower confidence",
  unknown: "unknown confidence"
};

export function ForecastConfidence({
  lastVerifiedAt,
  lastVerifiedLabel,
  variant = "card"
}: ForecastConfidenceProps) {
  const days = daysSinceChecked(lastVerifiedAt);
  const tier = tierForDays(days);
  const label = chipLabel(tier, days, lastVerifiedLabel);
  const filled = tier === "high" ? 3 : tier === "medium" ? 2 : tier === "low" ? 1 : 0;
  const srLabel = `Forecast confidence: ${tierNames[tier]}. ${label}.`;

  const meter = (
    <span className="forecastBars" aria-hidden="true">
      {[1, 2, 3].map((bar) => (
        <i key={bar} className={bar <= filled ? "filled" : ""} />
      ))}
    </span>
  );

  if (variant === "detail") {
    return (
      <div className={`forecastRead forecastReadDetail forecast-${tier}`} aria-label={srLabel}>
        <span className="forecastChipRow">
          {meter}
          <strong>{label}</strong>
        </span>
        <p>{detailNotes[tier]}</p>
      </div>
    );
  }

  return (
    <span className={`forecastRead forecast-${tier}`} aria-label={srLabel}>
      {meter}
      <span className="forecastLabel">{label}</span>
    </span>
  );
}
