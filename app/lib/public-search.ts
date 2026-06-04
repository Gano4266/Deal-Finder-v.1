export function normalizeSearchQuery(value?: string): string {
  return (value ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
}

function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("en-US")
    .replace(/[$,]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesSearchQuery(values: Array<string | number | undefined | null>, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  const haystack = normalizeSearchText(values.filter((value) => value !== undefined && value !== null).join(" "));
  return normalizedQuery.split(" ").every((token) => haystack.includes(token));
}
