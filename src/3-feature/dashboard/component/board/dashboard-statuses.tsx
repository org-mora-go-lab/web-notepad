import { getStatusColor } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

import type { DashboardStatusesProps } from "../../type";
import { DashboardStatus } from "./dashboard-status";

export function DashboardStatuses({
  columns,
  tabColorCycle,
  statusNames,
  iceboxVisible,
  closedVisible,
  iceboxCount,
  closedCount,
  onRenameStatus,
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
          label={statusNames.icebox ?? t.icebox}
          count={iceboxCount}
          tabColor="gray"
          onRename={onRenameStatus}
        />
      )}
      {columns.map(({ status, tabs }) => (
        <DashboardStatus
          key={status}
          id={`dashboard-status-${status}`}
          status={status}
          label={statusNames[status] ?? statusLabels[status]}
          count={tabs.length}
          tabColor={getStatusColor(status, tabColorCycle)}
          onRename={onRenameStatus}
        />
      ))}
      {closedVisible && (
        <DashboardStatus
          id="dashboard-status-closed"
          className="dashboard-closed-status"
          status="closed"
          label={statusNames.closed ?? t.closedTitle}
          count={closedCount}
          tabColor="purple"
          onRename={onRenameStatus}
        />
      )}
    </div>
  );
}
