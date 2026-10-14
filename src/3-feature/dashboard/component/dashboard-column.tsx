import { getStatusColor } from "@/src/4-entity/notepad";

import type { DashboardColumnProps } from "../type";
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
}: DashboardColumnProps) {
  const { status, tabs: columnTabs, closedTabs: columnClosed } = column;
  return (
    <section
      key={status}
      className={`dashboard-column ${drag.overStatus === status ? "is-drop-target" : ""}`}
      data-status={status}
      aria-labelledby={`dashboard-status-${status}`}
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
      <div className="dashboard-cards">
        {columnClosed.map((entry) => (
          <DashboardCard
            key={entry.id}
            id={entry.id}
            tab={entry.tab}
            groupName={
              showGroupNames
                ? (groups.find((group) => group.id === entry.groupId)?.name ??
                  "Ungrouped")
                : undefined
            }
            dragging={drag.draggingTabId === entry.id}
            onOpen={() => onRestoreClosed(entry.id)}
            onDragStart={drag.startDrag}
            onDragEnd={drag.endDrag}
          />
        ))}
        {columnTabs.map((tab) => (
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
            onDragStart={drag.startDrag}
            onDragEnd={drag.endDrag}
          />
        ))}
      </div>
    </section>
  );
}
