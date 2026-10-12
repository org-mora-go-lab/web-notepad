"use client";

import type { ComponentProps } from "react";

import { Bookmark, Closed, GlobalSearch, Group, Setting, Shortcut } from "@/src/3-feature";
import type { BookmarkEntry, ClosedTabEntry, GroupEntry } from "@/src/4-entity/notepad";
import type { ViewPanel } from "@/src/5-shared";

type Props = {
  openPanel: ViewPanel | null;
  pinned: boolean;
  onTogglePin: () => void;
  bookmarks: BookmarkEntry[];
  groups: GroupEntry[];
  activeGroupId: string;
  closedTabs: ClosedTabEntry[];
  closedSearchQuery: string;
  globalSearchQuery: string;
  onClose: () => void;
  onClosedSearchQueryChange: (query: string) => void;
  onGlobalSearchQueryChange: (query: string) => void;
  onOpenBookmark: ComponentProps<typeof Bookmark>["onOpen"];
  onRemoveBookmark: ComponentProps<typeof Bookmark>["onRemove"];
  onCreateGroup: ComponentProps<typeof Group>["onCreate"];
  onSelectGroup: ComponentProps<typeof Group>["onSelect"];
  onRemoveGroup: ComponentProps<typeof Group>["onRemove"];
  onRenameGroup: ComponentProps<typeof Group>["onRename"];
  onRestoreClosedTab: ComponentProps<typeof Closed>["onRestore"];
  onRemoveClosedTab: ComponentProps<typeof Closed>["onRemove"];
  onOpenSearchedBookmark: ComponentProps<typeof GlobalSearch>["onOpenBookmark"];
  onOpenClosedSearch: ComponentProps<typeof GlobalSearch>["onOpenClosedSearch"];
};

export function Panel({
  openPanel,
  pinned,
  onTogglePin,
  bookmarks,
  groups,
  activeGroupId,
  closedTabs,
  closedSearchQuery,
  globalSearchQuery,
  onClose,
  onClosedSearchQueryChange,
  onGlobalSearchQueryChange,
  onOpenBookmark,
  onRemoveBookmark,
  onCreateGroup,
  onSelectGroup,
  onRemoveGroup,
  onRenameGroup,
  onRestoreClosedTab,
  onRemoveClosedTab,
  onOpenSearchedBookmark,
  onOpenClosedSearch,
}: Props) {
  return (
    <div className="panel">
      <Bookmark
        bookmarks={bookmarks}
        open={openPanel === "bookmarks"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
        onOpen={onOpenBookmark}
        onRemove={onRemoveBookmark}
      />
      <Group
        groups={groups}
        activeGroupId={activeGroupId}
        open={openPanel === "groups"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
        onCreate={onCreateGroup}
        onSelect={onSelectGroup}
        onRemove={onRemoveGroup}
        onRename={onRenameGroup}
      />
      <Closed
        closedTabs={closedTabs}
        groups={groups}
        searchQuery={closedSearchQuery}
        open={openPanel === "closed"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
        onSearchQueryChange={onClosedSearchQueryChange}
        onRestore={onRestoreClosedTab}
        onRemove={onRemoveClosedTab}
      />
      <GlobalSearch
        groups={groups}
        closedTabs={closedTabs}
        searchQuery={globalSearchQuery}
        onSearchQueryChange={onGlobalSearchQueryChange}
        open={openPanel === "global-search"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
        onSelectGroup={onSelectGroup}
        onOpenBookmark={onOpenSearchedBookmark}
        onOpenClosedSearch={onOpenClosedSearch}
      />
      <Shortcut
        open={openPanel === "shortcuts"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
      />
      <Setting
        open={openPanel === "settings"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
      />
    </div>
  );
}
