import { getStatusColor } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

import type { DashboardStatusesProps } from "../../type";
import { DashboardStatus } from "./dashboard-status";

export function DashboardStatuses({
  columns,
  tabColorCycle,
  iceboxVisible,
  closedVisible,
  iceboxCount,
  closedCount,
}: DashboardStatusesProps) {
  const { t } = useI18n();
  const statusLabels = {
    icebox: t.icebox,
    todo: t.statusTodo,
    "in-progress": t.statusInProgress,
    done: t.statusDone,
    closed: t.closedTitle,
  };
  return (
    <div
      className={`dashboard-statuses ${iceboxVisible ? "has-icebox" : ""} ${closedVisible ? "has-closed" : ""}`}
    >
      {iceboxVisible && (
        <DashboardStatus
          id="dashboard-status-icebox"
          className="dashboard-icebox-status"
          status="icebox"
          label={t.icebox}
          count={iceboxCount}
          tabColor="gray"
        />
      )}
      {columns.map(({ status, tabs }) => (
        <DashboardStatus
          key={status}
          id={`dashboard-status-${status}`}
          status={status}
          label={statusLabels[status]}
          count={tabs.length}
          tabColor={getStatusColor(status, tabColorCycle)}
        />
      ))}
      {closedVisible && (
        <DashboardStatus
          id="dashboard-status-closed"
          className="dashboard-closed-status"
          status="closed"
          label={t.closedTitle}
          count={closedCount}
          tabColor="purple"
        />
      )}
    </div>
  );
}
