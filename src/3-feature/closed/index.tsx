"use client";

import { Archive, X } from "lucide-react";
import { useId, useRef, useState } from "react";

import {
  useI18n,
  useModalDialog,
  useScrollableListLayout,
  useSplitPaneResize,
} from "@/src/5-shared/hook";
import { EmptyState, SearchField } from "@/src/5-shared/ui";
import { matchesSearchQuery } from "@/src/5-shared/util";

import { ClosedItem, ClosedPreview } from "./component";
import type { ClosedProps } from "./type";

export function Closed({
  entries,
  open,
  onClose,
  onRestore,
  onRemove,
}: ClosedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const { t } = useI18n();
  const dialogRef = useModalDialog(open, 'input[type="search"]');
  const titleId = useId();
  const filteredEntries = entries.filter((entry) =>
    matchesSearchQuery(searchQuery, entry.tab.title, entry.tab.content),
  );
  const selectedEntry = filteredEntries.find(
    (entry) => entry.id === selectedEntryId,
  );
  const { containerRef, listRef } = useScrollableListLayout(
    "--closed-scrollbar-width",
  );
  const bodyRef = useRef<HTMLDivElement>(null);
  const handleSplitResizeStart = useSplitPaneResize(
    bodyRef,
    "--closed-results-width",
  );
  const closeClosed = () => {
    setSelectedEntryId(null);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="closed"
      id="closed-popup"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        closeClosed();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeClosed();
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
          onClick={closeClosed}
        >
          <X size={18} />
        </button>
      </div>
      <div className="closed-body" ref={bodyRef}>
        <div className="closed-results-pane" ref={containerRef}>
          <SearchField
            value={searchQuery}
            ariaLabel={t.searchClosed}
            placeholder={t.searchClosed}
            onChange={setSearchQuery}
          />
          <div className="closed-list" ref={listRef}>
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
                  selected={entry.id === selectedEntryId}
                  onSelect={() => setSelectedEntryId(entry.id)}
                />
              ))
            )}
          </div>
        </div>
        <div
          className="closed-split-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize closed list and preview"
          onPointerDown={handleSplitResizeStart}
        />
        <div className="closed-preview-pane">
          {selectedEntry ? (
            <ClosedPreview
              entry={selectedEntry}
              searchQuery={searchQuery}
              onRestore={onRestore}
              onRemove={onRemove}
            />
          ) : (
            <EmptyState
              className="closed-preview-empty"
              message={t.searchPreview}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
