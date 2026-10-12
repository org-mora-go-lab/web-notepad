"use client";

import { Ghost } from "lucide-react";
import { useState } from "react";

import type { ClosedTabEntry, GroupEntry } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup, SearchField, SidePanel } from "@/src/5-shared/ui";
import { matchesSearchQuery } from "@/src/5-shared/ui/search-field/util";

import { ClosedItem } from "./component";

type Props = {
  closedTabs: ClosedTabEntry[];
  groups: GroupEntry[];
  searchQuery: string;
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  onSearchQueryChange: (query: string) => void;
  onRestore: (entryId: string) => void;
  onRemove: (entryId: string) => void;
};

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
}: Props) {
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const { t } = useI18n();
  // Tabs whose group was deleted are listed (and restored) under Ungrouped.
  const entries = closedTabs.map((entry) => ({
    entry,
    groupName: groups.find((group) => group.id === entry.groupId)?.name ?? "Ungrouped",
  }));
  const filteredEntries = entries.filter(({ entry, groupName }) =>
    matchesSearchQuery(searchQuery, groupName, entry.tab.title, entry.tab.content),
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
              onRemove={setDeletingEntryId}
            />
          ))
        )}
      </div>
    {deletingEntryId && (
      <ConfirmPopup
        title={t.deleteClosedTabTitle}
        message={t.deleteClosedTabMessage}
        closeLabel="삭제 확인 닫기"
        closeTitle={t.close}
        onCancel={() => setDeletingEntryId(null)}
        onConfirm={() => {
          onRemove(deletingEntryId);
          setDeletingEntryId(null);
        }}
      />
    )}
    </SidePanel>
  );
}
