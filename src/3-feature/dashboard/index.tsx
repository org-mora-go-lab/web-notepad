"use client";

import { CheckCheck, Maximize2, Minimize2, StickyNote } from "lucide-react";
import { useState } from "react";

import {
  compareGroups,
  getDashboardColumns,
  getTabStatus,
  UNGROUPED_GROUP_ID,
  useNotepadStore,
} from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { SidePanel, TabContextMenu } from "@/src/5-shared/ui";

import {
  DashboardColumn,
  DashboardOptions,
  DashboardStatuses,
} from "./component";
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
  onMoveCard,
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
  const defaults = useNotepadStore(
    (state) => state.settings.dashboardStatusDefaults,
  );
  const displayStatusNames = { ...defaults, ...statusNames };
  const { contentRef, listRef, boardRef, scrollToCard } = useDashboardScroll(
    open,
    activeTabId,
  );
  const openCard = (tabId: string) => {
    if (drag.isRecentDrag()) return;
    onOpenTab(tabId);
    requestAnimationFrame(() => scrollToCard(tabId));
  };
  const columns = getDashboardColumns(tabs, tabColorCycle).filter(
    (column) => column.status !== "done" || doneVisible,
  );
  const iceboxTabs = tabs.filter(
    (tab) =>
      tab.content.trim() && getTabStatus(tab, tabColorCycle) === "icebox",
  );
  const visibleTabs = [
    ...columns.flatMap((column) => column.tabs),
    ...(iceboxVisible ? iceboxTabs : []),
  ];
  const contextTab = visibleTabs.find((tab) => tab.id === contextMenu?.itemId);
  const contextGroup = groups.find((group) =>
    group.tabs.some((tab) => tab.id === contextMenu?.itemId),
  );
  const contextStatus = contextTab
    ? getTabStatus(contextTab, tabColorCycle)
    : null;
  const shortcutStatus =
    contextStatus === "todo"
      ? "icebox"
      : contextStatus === "in-progress"
        ? "done"
        : null;
  const drag = useDashboardDrag({ visibleTabs, onMoveCard });
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
              groupName={
                showGroupNames
                  ? t.allGroup
                  : (groups.find((group) => group.id === groupId)?.name ??
                    t.ungrouped)
              }
              statusNames={statusNames}
              onSaveStatusNames={onSaveStatusNames}
              iceboxVisible={iceboxVisible}
              doneVisible={doneVisible}
              onToggleIcebox={() =>
                onVisibilityChange({ ...visibility, icebox: !iceboxVisible })
              }
              onToggleDone={() =>
                onVisibilityChange({ ...visibility, done: !doneVisible })
              }
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
          statusNames={displayStatusNames}
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
                statusNames={displayStatusNames}
                column={{ status: "icebox", tabs: iceboxTabs }}
                drag={drag}
                activeTabId={activeTabId}
                groups={groups}
                showGroupNames={showGroupNames}
                tabColorCycle={tabColorCycle}
                contextMenuTabId={contextMenu?.itemId}
                onOpenTab={openCard}
                onOpenContextMenu={(itemId, left, top) =>
                  setContextMenu({ itemId, left, top })
                }
              />
            )}
            {columns.map((column) => (
              <DashboardColumn
                key={column.status}
                statusNames={displayStatusNames}
                column={column}
                drag={drag}
                activeTabId={activeTabId}
                groups={groups}
                showGroupNames={showGroupNames}
                tabColorCycle={tabColorCycle}
                contextMenuTabId={contextMenu?.itemId}
                onOpenTab={openCard}
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
          footerAction={
            shortcutStatus && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onChangeStatus(contextTab.id, shortcutStatus);
                  setContextMenu(null);
                }}
              >
                {shortcutStatus === "icebox" ? (
                  <StickyNote size={14} />
                ) : (
                  <CheckCheck size={14} />
                )}
                <span>
                  {t.moveToStatus(
                    displayStatusNames[shortcutStatus] ??
                      (shortcutStatus === "icebox" ? t.icebox : t.statusDone),
                  )}
                </span>
              </button>
            )
          }
          bookmarked={contextTab.bookmarked}
          targetGroups={groups
            .filter(
              (group) =>
                group.id !== contextGroup?.id &&
                group.id !== UNGROUPED_GROUP_ID,
            )
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
