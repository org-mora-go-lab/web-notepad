import { getStatusColor } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

import type { DashboardStatusesProps } from "../../type";
import { DashboardStatus } from "./dashboard-status";

export function DashboardStatuses({
  columns,
  tabColorCycle,
  statusNames,
  iceboxVisible,
  iceboxCount,
}: DashboardStatusesProps) {
  const { t } = useI18n();
  const statusLabels = {
    icebox: t.icebox,
    todo: t.statusTodo,
    ready: t.statusReady,
    "in-progress": t.statusInProgress,
    done: t.statusDone,
    closed: t.closedTitle,
  };
  return (
    <div
      className={`dashboard-statuses ${iceboxVisible ? "has-icebox" : ""} ${columns.some((column) => column.status === "done") ? "has-done" : ""}`}
    >
      {iceboxVisible && (
        <DashboardStatus
          id="dashboard-status-icebox"
          className="dashboard-icebox-status"
          status="icebox"
          label={statusNames.icebox ?? t.icebox}
          count={iceboxCount}
          tabColor="gray"
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
        />
      ))}
    </div>
  );
}
