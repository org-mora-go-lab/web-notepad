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
  pinned,
  onTogglePin,
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
  onAddDashboardTask,
  onChangeTabStatus,
  onSaveDashboardStatusNames,
  onMoveDashboardTabToGroup,
  onToggleDashboardTabPin,
  onToggleDashboardTabBookmark,
  onDeleteDashboardTab,
  onCreateGroup,
  onSelectGroup,
  onRemoveGroup,
  onRenameGroup,
  onToggleGroupPin,
}: PanelProps) {
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
        groupId={activeGroupId}
        statusNames={groups.find((group) => group.id === activeGroupId)?.dashboardStatusNames ?? {}}
        onSaveStatusNames={onSaveDashboardStatusNames}
        tabs={activeGroupTabs}
        activeTabId={activeTabId}
        groups={groups}
        showGroupNames={activeGroupId === ALL_GROUP_ID}
        tabColorCycle={tabColorCycle}
        open={openPanel === "dashboard" || backgroundPanel === "dashboard"}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClose={onClose}
        onOpenTab={onOpenDashboardTab}
        onAddTask={onAddDashboardTask}
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
