"use client";

import { useState } from "react";

import type { GroupEntry, NoteTab, TabColor, TabStatus } from "@/src/4-entity/notepad";
import { getStatusColor, getTabStatus, TAB_STATUSES } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import { SidePanel } from "@/src/5-shared/ui";

import { DashboardCard } from "./component";

type Props = {
  groupName: string;
  tabs: NoteTab[];
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
};

// Kanban board of the current group's tabs. A tab's column follows its tab color:
// the 1st, 2nd and 3rd color of the tab color cycle are Todo, In Progress and Done.
export function Dashboard({
  groupName,
  tabs,
  groups,
  showGroupNames,
  tabColorCycle,
  open,
  pinned,
  onTogglePin,
  onClose,
  onOpenTab,
  onChangeStatus,
}: Props) {
  const { t } = useI18n();
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TabStatus | null>(null);
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
        <p className="dashboard-group">{groupName}</p>
        <div className="dashboard-board">
          {TAB_STATUSES.map((status) => {
            const columnTabs = tabs.filter((tab) => getTabStatus(tab, tabColorCycle) === status);
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
                  if (draggingTabId) onChangeStatus(draggingTabId, status);
                  endDrag();
                }}
              >
                <h3>
                  {statusLabels[status]}
                  <span className="dashboard-count">{columnTabs.length}</span>
                </h3>
                <div className="dashboard-cards">
                  {columnTabs.map((tab) => (
                    <DashboardCard
                      key={tab.id}
                      tab={tab}
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
    </SidePanel>
  );
}
