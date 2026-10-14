import { normalizeSearchQuery } from "./normalize-search-query";

export function matchesSearchQuery(
  query: string,
  ...values: string[]
): boolean {
  const normalizedQuery = normalizeSearchQuery(query);
  return (
    normalizedQuery.length === 0 ||
    values.some((value) => value.toLowerCase().includes(normalizedQuery))
  );
}
