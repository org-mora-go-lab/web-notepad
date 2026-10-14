"use client";

import { useState } from "react";

import type { ClosedTabEntry, GroupEntry, NoteTab, TabColor, TabStatus } from "@/src/4-entity/notepad";
import { getStatusColor, getTabStatus, TAB_STATUSES } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup, SidePanel } from "@/src/5-shared/ui";

import { DashboardCard } from "./component";

type Props = {
  tabs: NoteTab[];
  activeTabId?: string;
  // Closed tabs of the shown group(s); they fill the Closed column.
  closedTabs: ClosedTabEntry[];
  groups: GroupEntry[];
  // All Group: cards show the group they belong to.
  showGroupNames: boolean;
  tabColorCycle: TabColor[];
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  onOpenTab: (tabId: string) => void;
  onChangeStatus: (tabId: string, status: TabStatus) => void;
  onUnpinTab: (tabId: string) => void;
  onRestoreClosed: (entryId: string) => void;
  onChangeClosedStatus: (entryId: string, status: TabStatus) => void;
};

// Kanban board of the current group's tabs. A tab's column follows its tab color:
// the 1st, 2nd and 3rd color of the tab color cycle are Todo, WIP and Done.
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
  onUnpinTab,
  onRestoreClosed,
  onChangeClosedStatus,
}: Props) {
  const { t } = useI18n();
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  // Empty notes are not listed on the dashboard.
  const visibleTabs = tabs.filter((tab) => tab.content.trim());
  const visibleClosedTabs = closedTabs.filter((entry) => entry.tab.content.trim());
  const [overStatus, setOverStatus] = useState<TabStatus | null>(null);
  // A pinned tab dropped on Closed waits for confirmation before it is unpinned and closed.
  const [pendingPinnedTabId, setPendingPinnedTabId] = useState<string | null>(null);
  const statusLabels: Record<TabStatus, string> = {
    todo: t.statusTodo,
    "in-progress": t.statusInProgress,
    done: t.statusDone,
  };
  const endDrag = () => {
    setDraggingTabId(null);
    setOverStatus(null);
  };

  return (
    <SidePanel
      className="dashboard"
      id="dashboard-panel"
      title={t.dashboardTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel="대시보드 닫기"
      onClose={onClose}
    >
      <div className="dashboard-list">
        <div className="dashboard-board">
          {TAB_STATUSES.map((status) => {
            const columnTabs = visibleTabs.filter((tab) => getTabStatus(tab, tabColorCycle) === status);
            const columnClosed = status === "done" ? visibleClosedTabs : [];
            return (
              <section
                key={status}
                className={`dashboard-column ${overStatus === status ? "is-drop-target" : ""}`}
                data-status={status}
                data-tab-color={getStatusColor(status, tabColorCycle)}
                onDragOver={(event) => {
                  if (!draggingTabId) return;
                  event.preventDefault();
                  setOverStatus(status);
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setOverStatus((current) => (current === status ? null : current));
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggingTabId?.startsWith("closed-")) {
                    if (status !== "done") onChangeClosedStatus(draggingTabId, status);
                  } else if (draggingTabId) {
                    const dragged = visibleTabs.find((tab) => tab.id === draggingTabId);
                    if (status === "done" && dragged?.pinned) setPendingPinnedTabId(draggingTabId);
                    else onChangeStatus(draggingTabId, status);
                  }
                  endDrag();
                }}
              >
                <h3>
                  {statusLabels[status]}
                  <span className="dashboard-count">{columnTabs.length + columnClosed.length}</span>
                </h3>
                <div className="dashboard-cards">
                  {columnClosed.map((entry) => (
                    <DashboardCard
                      key={entry.id}
                      id={entry.id}
                      tab={entry.tab}
                      groupName={showGroupNames ? groups.find((group) => group.id === entry.groupId)?.name ?? "Ungrouped" : undefined}
                      dragging={draggingTabId === entry.id}
                      onOpen={() => onRestoreClosed(entry.id)}
                      onDragStart={(entryId, event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", entryId);
                        setDraggingTabId(entryId);
                      }}
                      onDragEnd={endDrag}
                    />
                  ))}
                  {columnTabs.map((tab) => (
                    <DashboardCard
                      key={tab.id}
                      tab={tab}
                      active={tab.id === activeTabId}
                      groupName={
                        showGroupNames
                          ? groups.find((group) => group.tabs.some((item) => item.id === tab.id))?.name
                          : undefined
                      }
                      dragging={draggingTabId === tab.id}
                      onOpen={onOpenTab}
                      onDragStart={(tabId, event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", tabId);
                        setDraggingTabId(tabId);
                      }}
                      onDragEnd={endDrag}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
      {pendingPinnedTabId && (
        <ConfirmPopup
          title={t.closePinnedTabTitle}
          message={t.closePinnedTabMessage}
          closeLabel="Close confirmation"
          closeTitle={t.close}
          confirmLabel={t.unpinAndClose}
          onConfirm={() => {
            onUnpinTab(pendingPinnedTabId);
            onChangeStatus(pendingPinnedTabId, "done");
            setPendingPinnedTabId(null);
          }}
          onCancel={() => setPendingPinnedTabId(null)}
        />
      )}
    </SidePanel>
  );
}
