export function displayDescription(description: string): string {
  const trimmed = description.trim();

  if (
    /^(Available|Served) /i.test(trimmed) ||
    /^Check source for any extra restrictions\.$/i.test(trimmed)
  ) {
    return "";
  }

  return trimmed;
}

export function displayRestaurantName(name: string): string {
  return name.replace(/\s+-\s+.+$/, "").trim();
}
