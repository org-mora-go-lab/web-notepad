"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

import { compareGroups, getDashboardColumns, getTabStatus, UNGROUPED_GROUP_ID } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { SidePanel, TabContextMenu } from "@/src/5-shared/ui";

import { DashboardColumn, DashboardOptions, DashboardStatuses } from "./component";
import { useDashboardDrag, useDashboardScroll } from "./hook";
import type { DashboardProps } from "./type";

export function Dashboard({
  groupId,
  statusNames,
  onSaveStatusNames,
  visibility,
  onVisibilityChange,
  tabs,
  activeTabId,
  groups,
  showGroupNames,
  tabColorCycle,
  open,
  onClose,
  onOpenTab,
  onChangeStatus,
  onMoveToGroup,
  onToggleTabBookmark,
  onDeleteTab,
}: DashboardProps) {
  const [expanded, setExpanded] = useState(false);
  const iceboxVisible = visibility.icebox;
  const doneVisible = visibility.done !== false;
  const [contextMenu, setContextMenu] = useState<{
    itemId: string;
    left: number;
    top: number;
  } | null>(null);
  const { t } = useI18n();
  const { contentRef, listRef, boardRef } = useDashboardScroll();
  const columns = getDashboardColumns(tabs, tabColorCycle).filter(column => column.status !== "done" || doneVisible);
  const iceboxTabs = tabs.filter(
    (tab) => tab.content.trim() && getTabStatus(tab, tabColorCycle) === "icebox",
  );
  const visibleTabs = [
    ...columns.flatMap((column) => column.tabs),
    ...(iceboxVisible ? iceboxTabs : []),
  ];
  const contextTab = visibleTabs.find((tab) => tab.id === contextMenu?.itemId);
  const contextGroup = groups.find((group) =>
    group.tabs.some((tab) => tab.id === contextMenu?.itemId),
  );
  const drag = useDashboardDrag({ visibleTabs, onChangeStatus });
  return (
    <SidePanel
      className="dashboard"
      id="dashboard-panel"
      title={t.dashboardTitle}
      open={open}
      expanded={open && expanded}
      headerActions={
        <>
          {open && (
            <DashboardOptions
              key={groupId}
              groupId={groupId}
              groupName={groups.find((group) => group.id === groupId)?.name ?? t.ungrouped}
              statusNames={statusNames}
              onSaveStatusNames={onSaveStatusNames}
              iceboxVisible={iceboxVisible}
              doneVisible={doneVisible}
              onToggleIcebox={() => onVisibilityChange({ ...visibility, icebox: !iceboxVisible })}
              onToggleDone={() => onVisibilityChange({ ...visibility, done: !doneVisible })}
            />
          )}
          <button
            className="side-panel-action dashboard-expand"
            type="button"
            onClick={() => setExpanded((current) => !current)}
            aria-pressed={expanded}
            aria-label={expanded ? t.collapseDashboard : t.expandDashboard}
            title={expanded ? t.collapseDashboard : t.expandDashboard}
          >
            {expanded ? <Minimize2 /> : <Maximize2 />}
          </button>
        </>
      }
      closeLabel={t.closePanel(t.dashboardTitle)}
      ariaLabel={t.dashboardTitle}
      onClose={onClose}
    >
      <div className="dashboard-content" ref={contentRef}>
        <DashboardStatuses
          statusNames={statusNames}
          columns={columns}
          tabColorCycle={tabColorCycle}
          iceboxVisible={iceboxVisible}
          iceboxCount={iceboxTabs.length}
        />
        <div className="dashboard-list" ref={listRef}>
          <div
            className={`dashboard-board ${iceboxVisible ? "has-icebox" : ""} ${doneVisible ? "has-done" : ""}`}
            ref={boardRef}
          >
            {iceboxVisible && (
              <DashboardColumn
                statusNames={statusNames}
                column={{ status: "icebox", tabs: iceboxTabs }}
                drag={drag}
                activeTabId={activeTabId}
                groups={groups}
                showGroupNames={showGroupNames}
                tabColorCycle={tabColorCycle}
                contextMenuTabId={contextMenu?.itemId}
                onOpenTab={onOpenTab}
                onOpenContextMenu={(itemId, left, top) =>
                  setContextMenu({ itemId, left, top })
                }
              />
            )}
            {columns.map((column) => (
              <DashboardColumn
                key={column.status}
                statusNames={statusNames}
                column={column}
                drag={drag}
                activeTabId={activeTabId}
                groups={groups}
                showGroupNames={showGroupNames}
                tabColorCycle={tabColorCycle}
                contextMenuTabId={contextMenu?.itemId}
                onOpenTab={onOpenTab}
                onOpenContextMenu={(itemId, left, top) =>
                  setContextMenu({ itemId, left, top })
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
          moveGroupFirst
          bookmarked={contextTab.bookmarked}
          targetGroups={groups
            .filter((group) => group.id !== contextGroup?.id && group.id !== UNGROUPED_GROUP_ID)
            .sort(compareGroups)}
          onMoveToGroup={(groupId) => {
            onMoveToGroup(contextTab.id, groupId);
            setContextMenu(null);
          }}
          onToggleBookmark={() => {
            onToggleTabBookmark(contextTab.id);
            setContextMenu(null);
          }}
          onDeleteTab={() => {
            onDeleteTab(contextTab.id);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </SidePanel>
  );
}
