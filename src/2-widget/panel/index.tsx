"use client";

import type { ComponentProps } from "react";

import { Bookmark, Closed, Dashboard, GlobalSearch, Group, Setting, Shortcut } from "@/src/3-feature";
import type { BookmarkEntry, ClosedTabEntry, GroupEntry, NoteTab, TabColor } from "@/src/4-entity/notepad";
import { ALL_GROUP_ID } from "@/src/4-entity/notepad";
import type { ViewPanel } from "@/src/5-shared";

type Props = {
  openPanel: ViewPanel | null;
  pinned: boolean;
  onTogglePin: () => void;
  bookmarks: BookmarkEntry[];
  activeGroupName: string;
  activeGroupTabs: NoteTab[];
  tabColorCycle: TabColor[];
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
  onOpenDashboardTab: ComponentProps<typeof Dashboard>["onOpenTab"];
  onChangeTabStatus: ComponentProps<typeof Dashboard>["onChangeStatus"];
  onUnpinTab: ComponentProps<typeof Dashboard>["onUnpinTab"];
  onChangeClosedTabStatus: ComponentProps<typeof Dashboard>["onChangeClosedStatus"];
  onCreateGroup: ComponentProps<typeof Group>["onCreate"];
  onSelectGroup: ComponentProps<typeof Group>["onSelect"];
  onRemoveGroup: ComponentProps<typeof Group>["onRemove"];
  onRenameGroup: ComponentProps<typeof Group>["onRename"];
  onToggleGroupPin: ComponentProps<typeof Group>["onTogglePinGroup"];
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
  activeGroupName,
  activeGroupTabs,
  tabColorCycle,
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
  onOpenDashboardTab,
  onChangeTabStatus,
  onUnpinTab,
  onChangeClosedTabStatus,
  onCreateGroup,
  onSelectGroup,
  onRemoveGroup,
  onRenameGroup,
  onToggleGroupPin,
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
      <Dashboard
        groupName={activeGroupName}
        tabs={activeGroupTabs}
        closedTabs={closedTabs.filter((entry) => activeGroupId === ALL_GROUP_ID || entry.groupId === activeGroupId)}
        groups={groups}
        showGroupNames={activeGroupId === ALL_GROUP_ID}
        tabColorCycle={tabColorCycle}
        open={openPanel === "dashboard"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
        onOpenTab={onOpenDashboardTab}
        onChangeStatus={onChangeTabStatus}
        onUnpinTab={onUnpinTab}
        onRestoreClosed={onRestoreClosedTab}
        onChangeClosedStatus={onChangeClosedTabStatus}
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
        onTogglePinGroup={onToggleGroupPin}
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
