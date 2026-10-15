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
import { ALL_GROUP_ID, getClosedTabItems } from "@/src/4-entity/notepad";

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
  globalSearchQuery,
  onClose,
  onCloseGroupMenu,
  onGlobalSearchQueryChange,
  onOpenBookmark,
  onRemoveBookmark,
  onOpenDashboardTab,
  onChangeTabStatus,
  onMoveDashboardTabToGroup,
  onToggleDashboardTabPin,
  onToggleDashboardTabBookmark,
  onArchiveDashboardTab,
  onRemoveClosedTab,
  onOpenClosed,
  onCreateGroup,
  onSelectGroup,
  onRemoveGroup,
  onRenameGroup,
  onToggleGroupPin,
  onRestoreClosedTab,
  onOpenSearchedBookmark,
}: PanelProps) {
  const visibleClosedTabs = getClosedTabItems(closedTabs, groups)
    .filter(
      ({ groupId }) =>
        activeGroupId === ALL_GROUP_ID || groupId === activeGroupId,
    )
    .map(({ entry }) => entry);

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
        groups={groups}
        showGroupNames={activeGroupId === ALL_GROUP_ID}
        tabColorCycle={tabColorCycle}
        open={openPanel === "dashboard"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
        onOpenTab={onOpenDashboardTab}
        onChangeStatus={onChangeTabStatus}
        onMoveToGroup={onMoveDashboardTabToGroup}
        onToggleTabPin={onToggleDashboardTabPin}
        onToggleTabBookmark={onToggleDashboardTabBookmark}
        onArchiveTab={onArchiveDashboardTab}
      />
      <Closed
        entries={visibleClosedTabs}
        open={openPanel === "closed"}
        onClose={onClose}
        onRestore={onRestoreClosedTab}
        onRemove={onRemoveClosedTab}
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
        onOpenClosed={onOpenClosed}
      />
      <GlobalSearch
        groups={groups}
        searchQuery={globalSearchQuery}
        onSearchQueryChange={onGlobalSearchQueryChange}
        open={openPanel === "global-search"}
        onClose={onClose}
        onSelectGroup={onSelectGroup}
        onOpenBookmark={onOpenSearchedBookmark}
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
