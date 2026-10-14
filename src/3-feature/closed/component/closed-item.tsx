"use client";

import { RotateCcw, Trash2 } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";
import { SearchHighlight } from "@/src/5-shared/ui/search-field/component";
import { formatDate } from "@/src/5-shared/util";

import type { ClosedItemProps } from "../type";

export function ClosedItem({
  entry,
  groupName,
  searchQuery,
  onRestore,
  onRemove,
}: ClosedItemProps) {
  const { t } = useI18n();
  return (
    <article className="closed-item">
      <div className="closed-item-heading">
        <strong title={groupName}>
          <SearchHighlight text={groupName} query={searchQuery} />
        </strong>
        <time dateTime={new Date(entry.closedAt).toISOString()}>
          {formatDate(entry.closedAt)}
        </time>
      </div>
      <p className="closed-item-content">
        <SearchHighlight text={entry.tab.content} query={searchQuery} />
      </p>
      <div className="closed-actions">
        <button type="button" onClick={() => onRestore(entry.id)}>
          <RotateCcw size={14} />
          {t.restore}
        </button>
        <button
          className="remove-closed"
          type="button"
          onClick={() => onRemove(entry.id)}
          aria-label={t.deleteClosedTabFor(entry.tab.title)}
          title={t.deleteClosedTab}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}
