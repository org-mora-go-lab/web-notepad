"use client";

import {
  Bookmark,
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
  backgroundPanel,
  pinned,
  onTogglePin,
  bookmarks,
  activeGroupTabs,
  activeTabId,
  tabColorCycle,
  dashboardStatusNames,
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
  onRenameDashboardStatus,
  onMoveDashboardTabToGroup,
  onToggleDashboardTabPin,
  onToggleDashboardTabBookmark,
  onArchiveDashboardTab,
  onRemoveClosedTab,
  onCreateGroup,
  onSelectGroup,
  onRemoveGroup,
  onRenameGroup,
  onToggleGroupPin,
  onRestoreClosedTab,
}: PanelProps) {
  const visibleClosedTabs = getClosedTabItems(closedTabs, groups)
    .filter(
      ({ groupId }) =>
        activeGroupId === ALL_GROUP_ID || groupId === activeGroupId,
    )
    .map(({ entry, groupName }) => ({ entry, groupName }));

  return (
    <div className="panel">
      <Bookmark
        bookmarks={bookmarks}
        open={openPanel === "bookmarks" || backgroundPanel === "bookmarks"}
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
        statusNames={dashboardStatusNames}
        open={openPanel === "dashboard" || backgroundPanel === "dashboard"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
        closedEntries={visibleClosedTabs}
        onRestoreClosed={onRestoreClosedTab}
        onRemoveClosed={onRemoveClosedTab}
        onOpenTab={onOpenDashboardTab}
        onChangeStatus={onChangeTabStatus}
        onRenameStatus={onRenameDashboardStatus}
        onMoveToGroup={onMoveDashboardTabToGroup}
        onToggleTabPin={onToggleDashboardTabPin}
        onToggleTabBookmark={onToggleDashboardTabBookmark}
        onArchiveTab={onArchiveDashboardTab}
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
      <GlobalSearch
        groups={groups}
        searchQuery={globalSearchQuery}
        onSearchQueryChange={onGlobalSearchQueryChange}
        open={openPanel === "global-search"}
        onClose={onClose}
        onSelectGroup={onSelectGroup}
      />
      <Shortcut
        open={openPanel === "shortcuts" || backgroundPanel === "shortcuts"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
      />
      <Setting
        open={openPanel === "settings" || backgroundPanel === "settings"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
      />
    </div>
  );
}
