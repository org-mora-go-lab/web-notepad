"use client";

import type { ComponentProps } from "react";

import type { BookmarkEntry, ClosedTabEntry, GroupEntry } from "@/src/entity/notepad";
import { Bookmark, Closed, GlobalSearch, Group, Shortcut } from "@/src/feature";
import type { ViewPanel } from "@/src/shared";

type Props = {
  openPanel: ViewPanel | null;
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
        onClose={onClose}
        onOpen={onOpenBookmark}
        onRemove={onRemoveBookmark}
      />
      <Group
        groups={groups}
        activeGroupId={activeGroupId}
        open={openPanel === "groups"}
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
        onClose={onClose}
        onSelectGroup={onSelectGroup}
        onOpenBookmark={onOpenSearchedBookmark}
        onOpenClosedSearch={onOpenClosedSearch}
      />
      <Shortcut open={openPanel === "shortcuts"} onClose={onClose} />
    </div>
  );
}
