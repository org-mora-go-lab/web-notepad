import { getStatusColor } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

import type { DashboardColumnProps } from "../../type";
import { DashboardCard } from "./dashboard-card";

export function DashboardColumn({
  column,
  drag,
  activeTabId,
  groups,
  showGroupNames,
  tabColorCycle,
  onRestoreClosed,
  onOpenTab,
  onOpenContextMenu,
}: DashboardColumnProps) {
  const { status, tabs: columnTabs, closedTabs: columnClosed } = column;
  const { t } = useI18n();
  const statusLabel = {
    todo: t.statusTodo,
    "in-progress": t.statusInProgress,
    done: t.statusDone,
  }[status];
  const cardEntries = [
    ...columnClosed.map((entry) => ({ entry, tab: entry.tab, closed: true })),
    ...columnTabs.map((tab) => ({ entry: null, tab, closed: false })),
  ].sort((left, right) => {
    const priority = (tab: typeof left.tab) =>
      tab.pinned ? 2 : tab.bookmarked ? 1 : 0;
    return (
      priority(right.tab) - priority(left.tab) ||
      left.tab.id.localeCompare(right.tab.id)
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
      <h3 className="dashboard-column-status" data-status={status}>
        {statusLabel}
        <span className="dashboard-count">
          {columnTabs.length + columnClosed.length}
        </span>
      </h3>
      <div className="dashboard-cards">
        {cardEntries.map(({ entry, tab, closed }) =>
          closed && entry ? (
            <DashboardCard
              key={entry.id}
              id={entry.id}
              tab={tab}
              closed
              groupName={
                showGroupNames
                  ? (groups.find((group) => group.id === entry.groupId)?.name ??
                    "Ungrouped")
                  : undefined
              }
              dragging={drag.draggingTabId === entry.id}
              onOpen={() => onRestoreClosed(entry.id)}
              onOpenContextMenu={(tabId, left, top) =>
                onOpenContextMenu(entry.id, left, top, true)
              }
              onDragStart={drag.startDrag}
              onDragEnd={drag.endDrag}
            />
          ) : (
            <DashboardCard
              key={tab.id}
              tab={tab}
              active={tab.id === activeTabId}
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
                onOpenContextMenu(tabId, left, top, false)
              }
              onDragStart={drag.startDrag}
              onDragEnd={drag.endDrag}
            />
          ),
        )}
      </div>
    </section>
  );
}
