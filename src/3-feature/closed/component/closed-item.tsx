import { SearchHighlight } from "@/src/5-shared/ui/search-field/component";
import { formatDate } from "@/src/5-shared/util";

import type { ClosedItemProps } from "../type";

export function ClosedItem({
  entry,
  searchQuery,
  selected,
  onSelect,
}: ClosedItemProps) {
  const { tab } = entry;

  return (
    <article className={`closed-item ${selected ? "is-selected" : ""}`}>
      <button className="closed-item-open" type="button" onClick={onSelect}>
        <div className="closed-item-heading">
          <strong>
            <SearchHighlight text={tab.title} query={searchQuery} />
          </strong>
          <time dateTime={new Date(entry.closedAt).toISOString()}>
            {formatDate(entry.closedAt)}
          </time>
        </div>
        <p
          className={`closed-item-content ${tab.content.trim() ? "" : "is-empty"}`}
        >
          <SearchHighlight text={tab.content} query={searchQuery} />
        </p>
      </button>
    </article>
  );
}
