import { Bookmark, FileText, Folder } from "lucide-react";

import { SearchHighlight } from "@/src/5-shared/ui/search-field/component";

import type { SearchResultProps } from "../type";

export function SearchResult({
  category,
  kind,
  groupName,
  title,
  description,
  query,
  ariaLabel,
  onSelect,
  selected = false,
}: SearchResultProps) {
  return (
    <button
      className={`global-search-result ${selected ? "is-selected" : ""}`}
      type="button"
      aria-label={ariaLabel}
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
    >
      <span className="global-search-result-category">
        {kind === "tab" ? <FileText size={14} aria-hidden="true" /> : groupName !== undefined ? <Bookmark size={14} aria-hidden="true" /> : <Folder size={14} aria-hidden="true" />}
        {category}
        {groupName && (
          <>
            {" · "}
            <SearchHighlight text={groupName} query={query} />
          </>
        )}
      </span>
      <strong>
        <SearchHighlight text={title} query={query} />
      </strong>
      {description !== undefined && (
        <p>
          <SearchHighlight text={description} query={query} />
        </p>
      )}
    </button>
  );
}
