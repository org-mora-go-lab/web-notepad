"use client";

import { Ghost } from "lucide-react";

import { getClosedTabItems } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { EmptyState, SearchField, SidePanel } from "@/src/5-shared/ui";
import { matchesSearchQuery } from "@/src/5-shared/util";

import { ClosedItem } from "./component";
import type { ClosedProps } from "./type";

export function Closed({
  closedTabs,
  groups,
  searchQuery,
  open,
  pinned,
  onTogglePin,
  onClose,
  onSearchQueryChange,
  onRestore,
  onRemove,
}: ClosedProps) {
  const { t } = useI18n();
  // Tabs whose group was deleted are listed (and restored) under Ungrouped.
  const entries = getClosedTabItems(closedTabs, groups);
  const filteredEntries = entries.filter(({ entry, groupName }) =>
    matchesSearchQuery(
      searchQuery,
      groupName,
      entry.tab.title,
      entry.tab.content,
    ),
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
        onChange={onSearchQueryChange}
      />
      <div className="closed-list">
        {closedTabs.length === 0 ? (
          <EmptyState
            className="closed-empty"
            icon={<Ghost size={26} strokeWidth={1.4} />}
            message={t.emptyClosed}
          />
        ) : filteredEntries.length === 0 ? (
          <EmptyState
            className="search-empty-state"
            search
            message={t.noSearchResults}
          />
        ) : (
          filteredEntries.map(({ entry, groupName }) => (
            <ClosedItem
              key={entry.id}
              entry={entry}
              groupName={groupName}
              searchQuery={searchQuery}
              onRestore={onRestore}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </SidePanel>
  );
}
