"use client";

import { Ghost } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";
import { SearchField, SidePanel } from "@/src/5-shared/ui";
import { matchesSearchQuery } from "@/src/5-shared/ui/search-field/util";

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
  const entries = closedTabs.map((entry) => ({
    entry,
    groupName:
      groups.find((group) => group.id === entry.groupId)?.name ?? "Ungrouped",
  }));
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
      closeLabel="닫은 탭 패널 닫기"
      onClose={onClose}
    >
      <SearchField
        value={searchQuery}
        ariaLabel="닫은 탭 검색"
        placeholder={t.searchClosed}
        onChange={onSearchQueryChange}
      />
      <div className="closed-list">
        {closedTabs.length === 0 ? (
          <div className="closed-empty">
            <Ghost size={26} strokeWidth={1.4} />
            <p>{t.emptyClosed}</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="search-empty-state">
            <p>{t.noSearchResults}</p>
          </div>
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
