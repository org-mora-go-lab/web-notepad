"use client";

import {
  Bookmark,
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
  backgroundPanel,
  bookmarks,
  activeGroupTabs,
  activeTabId,
  tabColorCycle,
  groups,
  activeGroupId,
  groupMenuOpen,
  globalSearchQuery,
  onClose,
  onCloseGroupMenu,
  onGlobalSearchQueryChange,
  onOpenBookmark,
  onRemoveBookmark,
  onOpenDashboardTab,
  onChangeTabStatus,
  onSaveDashboardStatusNames,
  dashboardVisibility,
  onDashboardVisibilityChange,
  onMoveDashboardTabToGroup,
  onToggleDashboardTabPin,
  onToggleDashboardTabBookmark,
  onDeleteDashboardTab,
  onCreateGroup,
  onSelectGroup,
  onRemoveGroup,
  onRenameGroup,
  onToggleGroupPin,
  onMoveGroup,
  onOpenGroupBookmarks,
}: PanelProps) {
  return (
    <div className="panel">
      <Bookmark
        bookmarks={bookmarks}
        open={openPanel === "bookmarks" || backgroundPanel === "bookmarks"}
        onClose={onClose}
        onOpen={onOpenBookmark}
        onRemove={onRemoveBookmark}
      />
      <Dashboard
        groupId={activeGroupId}
        statusNames={groups.find((group) => group.id === activeGroupId)?.dashboardStatusNames ?? {}}
        onSaveStatusNames={onSaveDashboardStatusNames}
        visibility={dashboardVisibility}
        onVisibilityChange={onDashboardVisibilityChange}
        tabs={activeGroupTabs}
        activeTabId={activeTabId}
        groups={groups}
        showGroupNames={activeGroupId === ALL_GROUP_ID}
        tabColorCycle={tabColorCycle}
        open={openPanel === "dashboard" || backgroundPanel === "dashboard"}
        onClose={onClose}
        onOpenTab={onOpenDashboardTab}
        onChangeStatus={onChangeTabStatus}
        onMoveToGroup={onMoveDashboardTabToGroup}
        onToggleTabPin={onToggleDashboardTabPin}
        onToggleTabBookmark={onToggleDashboardTabBookmark}
        onDeleteTab={onDeleteDashboardTab}
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
        onMoveGroup={onMoveGroup}
        onOpenBookmarks={onOpenGroupBookmarks}
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
        onClose={onClose}
      />
      <Setting
        open={openPanel === "settings" || backgroundPanel === "settings"}
        onClose={onClose}
      />
    </div>
  );
}
