import { useEffect, useState } from "react";

const SEARCH_DEBOUNCE_DELAY = 700;

export function useDebouncedSearchQuery(searchQuery: string) {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  return debouncedSearchQuery;
}
