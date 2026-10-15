import { getStatusColor } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

import type { DashboardStatusesProps } from "../../type";
import { DashboardStatus } from "./dashboard-status";

export function DashboardStatuses({
  columns,
  tabColorCycle,
  statusNames,
  onRenameStatus,
}: DashboardStatusesProps) {
  const { t } = useI18n();
  const statusLabels = {
    todo: t.statusTodo,
    "in-progress": t.statusInProgress,
    done: t.statusDone,
  };
  return (
    <div className="dashboard-statuses">
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
    </div>
  );
}
