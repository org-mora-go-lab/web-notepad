"use client";

import { useState } from "react";

import { compareGroups, getDashboardColumns } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { SidePanel, TabContextMenu } from "@/src/5-shared/ui";

import { DashboardColumn, DashboardStatuses } from "./component";
import { useDashboardDrag, useDashboardScroll } from "./hook";
import type { DashboardProps } from "./type";

export function Dashboard({
  tabs,
  activeTabId,
  closedTabs,
  groups,
  showGroupNames,
  tabColorCycle,
  open,
  pinned,
  onTogglePin,
  onClose,
  onOpenTab,
  onChangeStatus,
  onMoveToGroup,
  onToggleTabPin,
  onToggleTabBookmark,
  onRestoreClosed,
  onChangeClosedStatus,
  onMoveClosedToGroup,
  onToggleClosedBookmark,
}: DashboardProps) {
  const [contextMenu, setContextMenu] = useState<{
    itemId: string;
    closed: boolean;
    left: number;
    top: number;
  } | null>(null);
  const { t } = useI18n();
  const { contentRef, listRef, boardRef } = useDashboardScroll();
  const columns = getDashboardColumns(tabs, closedTabs, tabColorCycle);
  const visibleTabs = columns.flatMap((column) => column.tabs);
  const contextClosed = closedTabs.find(
    (entry) => contextMenu?.closed && entry.id === contextMenu.itemId,
  );
  const contextTab = contextClosed?.tab ?? visibleTabs.find(
    (tab) => !contextMenu?.closed && tab.id === contextMenu?.itemId,
  );
  const contextGroup = groups.find((group) =>
    contextClosed
      ? group.id === contextClosed.groupId
      : group.tabs.some((tab) => tab.id === contextMenu?.itemId),
  );
  const drag = useDashboardDrag({
    visibleTabs,
    onChangeStatus,
    onChangeClosedStatus,
  });
  return (
    <SidePanel
      className="dashboard"
      id="dashboard-panel"
      title={t.dashboardTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel={t.closePanel(t.dashboardTitle)}
      ariaLabel={t.dashboardTitle}
      onClose={onClose}
    >
      <div className="dashboard-content" ref={contentRef}>
        <DashboardStatuses columns={columns} tabColorCycle={tabColorCycle} />
        <div className="dashboard-list" ref={listRef}>
          <div className="dashboard-board" ref={boardRef}>
            {columns.map((column) => (
              <DashboardColumn
                key={column.status}
                column={column}
                drag={drag}
                activeTabId={activeTabId}
                groups={groups}
                showGroupNames={showGroupNames}
                tabColorCycle={tabColorCycle}
                onRestoreClosed={onRestoreClosed}
                onOpenTab={onOpenTab}
                onOpenContextMenu={(itemId, left, top, closed) =>
                  setContextMenu({ itemId, left, top, closed })
                }
              />
            ))}
          </div>
        </div>
      </div>
      {contextMenu && contextTab && (
        <TabContextMenu
          left={contextMenu.left}
          top={contextMenu.top}
          pinned={contextTab.pinned}
          showPin={false}
          bookmarked={contextTab.bookmarked}
          targetGroups={groups
            .filter((group) => group.id !== contextGroup?.id)
            .sort(compareGroups)}
          onMoveToGroup={(groupId) => {
            if (contextClosed) onMoveClosedToGroup(contextClosed.id, groupId);
            else onMoveToGroup(contextTab.id, groupId);
            setContextMenu(null);
          }}
          onTogglePin={() => {
            onToggleTabPin(contextTab.id);
            setContextMenu(null);
          }}
          onToggleBookmark={() => {
            if (contextClosed) onToggleClosedBookmark(contextClosed.id);
            else onToggleTabBookmark(contextTab.id);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </SidePanel>
  );
}
