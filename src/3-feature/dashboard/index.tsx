"use client";

import { Archive, Maximize2, Minimize2, Snowflake } from "lucide-react";
import { useState } from "react";

import {
  compareGroups,
  getDashboardColumns,
  getTabStatus,
} from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { SidePanel, TabContextMenu } from "@/src/5-shared/ui";

import { DashboardClosedColumn, DashboardColumn, DashboardStatuses } from "./component";
import { useDashboardDrag, useDashboardScroll } from "./hook";
import type { DashboardProps } from "./type";

export function Dashboard({
  tabs,
  activeTabId,
  groups,
  showGroupNames,
  tabColorCycle,
  statusNames,
  open,
  pinned,
  onTogglePin,
  onClose,
  closedEntries,
  onRestoreClosed,
  onRemoveClosed,
  onOpenTab,
  onChangeStatus,
  onRenameStatus,
  onMoveToGroup,
  onToggleTabPin,
  onToggleTabBookmark,
  onArchiveTab,
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
  const visibleTabs = columns.flatMap((column) => column.tabs);
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
      pinned={pinned}
      expanded={open && expanded}
      onTogglePin={onTogglePin}
      headerActions={
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
      }
      closeLabel={t.closePanel(t.dashboardTitle)}
      ariaLabel={t.dashboardTitle}
      onClose={onClose}
    >
      <div className="dashboard-content" ref={contentRef}>
        <DashboardStatuses
          columns={columns}
          tabColorCycle={tabColorCycle}
          statusNames={statusNames}
          iceboxVisible={iceboxVisible}
          closedVisible={closedVisible}
          closedCount={closedEntries.length}
          onRenameStatus={onRenameStatus}
        />
        <div className="dashboard-list" ref={listRef}>
          <div
            className={`dashboard-board ${iceboxVisible ? "has-icebox" : ""} ${closedVisible ? "has-closed" : ""}`}
            ref={boardRef}
          >
            {iceboxVisible && (
              <section
                className="dashboard-column dashboard-icebox-column"
                aria-label={t.icebox}
              >
                <h3 className="dashboard-column-status">
                  <span>{t.icebox}</span>
                  <span className="dashboard-count">0</span>
                </h3>
                <div className="dashboard-cards" />
              </section>
            )}
            {columns.map((column) => (
              <DashboardColumn
                key={column.status}
                column={column}
                drag={drag}
                activeTabId={activeTabId}
                groups={groups}
                showGroupNames={showGroupNames}
                tabColorCycle={tabColorCycle}
                statusNames={statusNames}
                contextMenuTabId={contextMenu?.itemId}
                onOpenTab={onOpenTab}
                onRenameStatus={onRenameStatus}
                onOpenContextMenu={(itemId, left, top) =>
                  setContextMenu({ itemId, left, top })
                }
              />
            ))}
            {closedVisible && (
              <DashboardClosedColumn
                entries={closedEntries}
                showGroupNames={showGroupNames}
                onRestore={onRestoreClosed}
                onRemove={onRemoveClosed}
              />
            )}
          </div>
        </div>
      </div>
      <div className="dashboard-footer">
        <button
          className="dashboard-icebox-command"
          type="button"
          aria-pressed={iceboxVisible}
          onClick={() => setIceboxVisible((current) => !current)}
        >
          <Snowflake size={24} strokeWidth={1.8} />
          <span>{t.icebox}</span>
        </button>
        <button
          className="dashboard-closed-command"
          type="button"
          aria-pressed={closedVisible}
          onClick={() => setClosedVisible((current) => !current)}
        >
          <Archive size={24} strokeWidth={1.8} />
          <span>{t.closed}</span>
        </button>
      </div>
      {contextMenu && contextTab && (
        <TabContextMenu
          left={contextMenu.left}
          top={contextMenu.top}
          pinned={contextTab.pinned}
          showPin={false}
          moveGroupFirst
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
          onCloseTab={
            getTabStatus(contextTab, tabColorCycle) === "done"
              ? () => {
                  onArchiveTab(contextTab.id);
                  setContextMenu(null);
                }
              : undefined
          }
          onClose={() => setContextMenu(null)}
        />
      )}
    </SidePanel>
  );
}
