export function firstDollarPriceValue(price: string): number | undefined {
  const dollarMatch = price.match(/\$\s*(\d+(?:\.\d{1,2})?)/);

  if (dollarMatch) {
    return Number(dollarMatch[1]);
  }

  if (/\bfor\b/i.test(price)) {
    return undefined;
  }

  const fallbackMatch = price.match(/\b(\d+(?:\.\d{1,2})?)\b/);
  return fallbackMatch ? Number(fallbackMatch[1]) : undefined;
}
