import { getStatusColor } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

import type { DashboardColumnProps } from "../../type";
import { DashboardCard } from "./dashboard-card";
import { DashboardStatus } from "./dashboard-status";

export function DashboardColumn({
  column,
  drag,
  activeTabId,
  groups,
  showGroupNames,
  tabColorCycle,
  statusNames,
  contextMenuTabId,
  onOpenTab,
  onRenameStatus,
  onOpenContextMenu,
}: DashboardColumnProps) {
  const { status, tabs: columnTabs } = column;
  const { t } = useI18n();
  const statusLabel = {
    todo: t.statusTodo,
    "in-progress": t.statusInProgress,
    done: t.statusDone,
  }[status];
  const cardEntries = [...columnTabs].sort((left, right) => {
    const priority = (tab: typeof left) =>
      tab.pinned ? 2 : tab.bookmarked ? 1 : 0;
    return (
      priority(right) - priority(left) || left.id.localeCompare(right.id)
    );
  });
  return (
    <section
      key={status}
      className={`dashboard-column ${drag.overStatus === status ? "is-drop-target" : ""}`}
      data-status={status}
      aria-label={statusLabel}
      data-tab-color={getStatusColor(status, tabColorCycle)}
      onDragOver={(event) => {
        if (!drag.draggingTabId) return;
        event.preventDefault();
        drag.setOverStatus(status);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          drag.setOverStatus((current) =>
            current === status ? null : current,
          );
        }
      }}
      onDrop={(event) => drag.drop(status, event)}
    >
      <DashboardStatus
        className="dashboard-column-status"
        status={status}
        label={statusNames[status] ?? statusLabel}
        count={columnTabs.length}
        tabColor={getStatusColor(status, tabColorCycle)}
        onRename={onRenameStatus}
      />
      <div className="dashboard-cards">
        {cardEntries.map((tab) => (
          <DashboardCard
            key={tab.id}
            tab={tab}
            active={tab.id === activeTabId}
            contextMenuTarget={tab.id === contextMenuTabId}
            groupName={
              showGroupNames
                ? groups.find((group) =>
                    group.tabs.some((item) => item.id === tab.id),
                  )?.name
                : undefined
            }
            dragging={drag.draggingTabId === tab.id}
            onOpen={onOpenTab}
            onOpenContextMenu={(tabId, left, top) =>
              onOpenContextMenu(tabId, left, top)
            }
            onDragStart={drag.startDrag}
            onDragEnd={drag.endDrag}
          />
        ))}
      </div>
    </section>
  );
}
