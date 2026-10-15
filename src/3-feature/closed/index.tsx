"use client";

import { Archive } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/src/5-shared/hook";
import { EmptyState, SearchField, SidePanel } from "@/src/5-shared/ui";
import { matchesSearchQuery } from "@/src/5-shared/util";

import { ClosedItem } from "./component";
import type { ClosedProps } from "./type";

export function Closed({
  entries,
  open,
  pinned,
  onTogglePin,
  onClose,
  onRestore,
  onMoveToTodo,
  onRemove,
}: ClosedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useI18n();
  const filteredEntries = entries.filter((entry) =>
    matchesSearchQuery(searchQuery, entry.tab.title, entry.tab.content),
  );

  return (
    <SidePanel
      className="closed"
      id="closed-panel"
      title={t.closedTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel={t.closePanel(t.closedTitle)}
      ariaLabel={t.closedTitle}
      onClose={onClose}
    >
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
              onMoveToTodo={onMoveToTodo}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </SidePanel>
  );
}
