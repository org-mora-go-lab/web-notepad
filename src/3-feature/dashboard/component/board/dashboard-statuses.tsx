import { getStatusColor } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

import type { DashboardStatusesProps } from "../../type";

export function DashboardStatuses({
  columns,
  tabColorCycle,
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
        <h3
          key={status}
          id={`dashboard-status-${status}`}
          data-status={status}
          data-tab-color={getStatusColor(status, tabColorCycle)}
        >
          {statusLabels[status]}
          <span className="dashboard-count">{tabs.length}</span>
        </h3>
      ))}
    </div>
  );
}
