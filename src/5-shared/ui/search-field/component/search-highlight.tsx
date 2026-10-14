import type { ReactNode } from "react";

import { normalizeSearchQuery } from "@/src/5-shared/util";

import type { SearchHighlightProps } from "../type";

export function SearchHighlight({ text, query }: SearchHighlightProps) {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return text;

  const normalizedText = text.toLowerCase();
  const parts: ReactNode[] = [];
  let cursor = 0;
  let matchIndex = normalizedText.indexOf(normalizedQuery, cursor);

  while (matchIndex !== -1) {
    const matchEnd = matchIndex + normalizedQuery.length;
    parts.push(text.slice(cursor, matchIndex));
    parts.push(
      <mark className="search-highlight" key={matchIndex}>
        {text.slice(matchIndex, matchEnd)}
      </mark>,
    );
    cursor = matchEnd;
    matchIndex = normalizedText.indexOf(normalizedQuery, cursor);
  }

  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
