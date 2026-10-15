"use client";

import { Archive, X } from "lucide-react";
import { useId, useState } from "react";

import { useI18n, useModalDialog } from "@/src/5-shared/hook";
import { EmptyState, SearchField } from "@/src/5-shared/ui";
import { matchesSearchQuery } from "@/src/5-shared/util";

import { ClosedItem } from "./component";
import type { ClosedProps } from "./type";

export function Closed({
  entries,
  open,
  onClose,
  onRestore,
  onRemove,
}: ClosedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useI18n();
  const dialogRef = useModalDialog(open, 'input[type="search"]');
  const titleId = useId();
  const filteredEntries = entries.filter((entry) =>
    matchesSearchQuery(searchQuery, entry.tab.title, entry.tab.content),
  );

  return (
    <dialog
      ref={dialogRef}
      className="closed"
      id="closed-popup"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="closed-header">
        <div className="closed-heading">
          <Archive size={20} aria-hidden="true" />
          <h2 id={titleId}>{t.closedTitle}</h2>
        </div>
        <button
          className="closed-close"
          type="button"
          aria-label={t.closePanel(t.closedTitle)}
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      <SearchField
        value={searchQuery}
        ariaLabel={t.searchClosed}
        placeholder={t.searchClosed}
        onChange={setSearchQuery}
      />
      <div className="closed-list">
        {entries.length === 0 ? (
          <EmptyState
            className="closed-empty"
            icon={<Archive size={26} strokeWidth={1.4} />}
            message={t.emptyClosed}
          />
        ) : filteredEntries.length === 0 ? (
          <EmptyState
            className="search-empty-state"
            search
            message={t.noSearchResults}
          />
        ) : (
          filteredEntries.map((entry) => (
            <ClosedItem
              key={entry.id}
              entry={entry}
              searchQuery={searchQuery}
              onRestore={onRestore}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </dialog>
  );
}
