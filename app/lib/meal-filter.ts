import type { PublicDeal } from "./data";

export const mealFilterOptions = [
  { value: "all", label: "All" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" }
] as const;

export type MealFilter = (typeof mealFilterOptions)[number]["value"];

function minutesFromTime(value: string): number | undefined {
  const [hourText, minuteText = "0"] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return undefined;
  }

  return hour * 60 + minute;
}

function overlapsWindow(startTime: string, endTime: string, periodStart: number, periodEnd: number): boolean {
  const start = minutesFromTime(startTime);
  const end = minutesFromTime(endTime);

  if (start === undefined && end === undefined) {
    return false;
  }

  const effectiveStart = start ?? 0;
  const effectiveEnd = end ?? 24 * 60;

  return effectiveStart < periodEnd && effectiveEnd > periodStart;
}

function searchableMealText(deal: PublicDeal): string {
  return [
    deal.publicTitle,
    deal.publicDescription,
    deal.dealType,
    deal.restrictionNotes,
    deal.evidenceSummary,
    deal.sourceQuote,
    deal.sourceName
  ].join(" ").toLowerCase();
}

export function dealMatchesMealFilter(deal: PublicDeal, meal: MealFilter): boolean {
  if (meal === "all") {
    return true;
  }

  const text = searchableMealText(deal);

  if (meal === "breakfast") {
    return (
      text.includes("breakfast") ||
      text.includes("brunch") ||
      overlapsWindow(deal.startTime, deal.endTime, 5 * 60, 11 * 60 + 30)
    );
  }

  if (meal === "lunch") {
    return (
      text.includes("lunch") ||
      text.includes("brunch") ||
      overlapsWindow(deal.startTime, deal.endTime, 11 * 60, 16 * 60)
    );
  }

  return (
    text.includes("dinner") ||
    text.includes("supper") ||
    text.includes("evening") ||
    overlapsWindow(deal.startTime, deal.endTime, 16 * 60, 24 * 60)
  );
}
