"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

import { compareGroups, getDashboardColumns, getTabStatus } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { SidePanel, TabContextMenu } from "@/src/5-shared/ui";

import { DashboardColumn, DashboardOptions, DashboardStatuses } from "./component";
import { useDashboardDrag, useDashboardScroll } from "./hook";
import type { DashboardProps } from "./type";

export function Dashboard({
  groupId,
  statusNames,
  onSaveStatusNames,
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
  onToggleTabPin,
  onToggleTabBookmark,
  onDeleteTab,
}: DashboardProps) {
  const [expanded, setExpanded] = useState(false);
  const [iceboxVisible, setIceboxVisible] = useState(false);
  const [closedVisible, setClosedVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    itemId: string;
    left: number;
    top: number;
  } | null>(null);
  const { t } = useI18n();
  const { contentRef, listRef, boardRef } = useDashboardScroll();
  const columns = getDashboardColumns(tabs, tabColorCycle);
  const iceboxTabs = tabs.filter(
    (tab) => tab.content.trim() && getTabStatus(tab, tabColorCycle) === "icebox",
  );
  const closedTabs = tabs.filter(
    (tab) => tab.content.trim() && getTabStatus(tab, tabColorCycle) === "closed",
  );
  const visibleTabs = [
    ...columns.flatMap((column) => column.tabs),
    ...(iceboxVisible ? iceboxTabs : []),
    ...(closedVisible ? closedTabs : []),
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
          {open && (
            <DashboardOptions
              key={groupId}
              groupId={groupId}
              groupName={groups.find((group) => group.id === groupId)?.name ?? t.ungrouped}
              statusNames={statusNames}
              onSaveStatusNames={onSaveStatusNames}
              iceboxVisible={iceboxVisible}
              closedVisible={closedVisible}
              onToggleIcebox={() => setIceboxVisible((current) => !current)}
              onToggleClosed={() => setClosedVisible((current) => !current)}
            />
          )}
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
          closedVisible={closedVisible}
          iceboxCount={iceboxTabs.length}
          closedCount={closedTabs.length}
        />
        <div className="dashboard-list" ref={listRef}>
          <div
            className={`dashboard-board ${iceboxVisible ? "has-icebox" : ""} ${closedVisible ? "has-closed" : ""}`}
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
            {closedVisible && (
              <DashboardColumn
                statusNames={statusNames}
                column={{ status: "closed", tabs: closedTabs }}
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
          </div>
        </div>
      </div>
      {contextMenu && contextTab && (
        <TabContextMenu
          left={contextMenu.left}
          top={contextMenu.top}
          pinned={contextTab.pinned}
          showPin={false}
          moveGroupFirst={getTabStatus(contextTab, tabColorCycle) !== "closed"}
          deleteOnly={getTabStatus(contextTab, tabColorCycle) === "closed"}
          bookmarked={contextTab.bookmarked}
          targetGroups={groups
            .filter((group) => group.id !== contextGroup?.id)
            .sort(compareGroups)}
          onMoveToGroup={(groupId) => {
            onMoveToGroup(contextTab.id, groupId);
            setContextMenu(null);
          }}
          onTogglePin={() => {
            onToggleTabPin(contextTab.id);
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
