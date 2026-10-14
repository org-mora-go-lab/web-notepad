"use client";

import {
  Bookmark,
  Closed,
  Dashboard,
  GlobalSearch,
  Group,
  Setting,
  Shortcut,
} from "@/src/3-feature";
import { ALL_GROUP_ID } from "@/src/4-entity/notepad";

import type { PanelProps } from "./type";

export function Panel({
  openPanel,
  pinned,
  onTogglePin,
  bookmarks,
  activeGroupTabs,
  activeTabId,
  tabColorCycle,
  groups,
  activeGroupId,
  groupMenuOpen,
  closedTabs,
  closedSearchQuery,
  globalSearchQuery,
  onClose,
  onCloseGroupMenu,
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
}: PanelProps) {
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
        tabs={activeGroupTabs}
        activeTabId={activeTabId}
        closedTabs={closedTabs.filter(
          (entry) =>
            activeGroupId === ALL_GROUP_ID || entry.groupId === activeGroupId,
        )}
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
        open={groupMenuOpen}
        onClose={onCloseGroupMenu}
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
