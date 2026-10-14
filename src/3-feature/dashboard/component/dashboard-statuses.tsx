import {
  type DashboardColumnData,
  getStatusColor,
  type TabColor,
} from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

export function DashboardStatuses({
  columns,
  tabColorCycle,
}: {
  columns: DashboardColumnData[];
  tabColorCycle: TabColor[];
}) {
  const { t } = useI18n();
  const statusLabels = {
    todo: t.statusTodo,
    "in-progress": t.statusInProgress,
    done: t.statusDone,
  };
  return (
    <div className="dashboard-statuses">
      {columns.map(({ status, tabs, closedTabs }) => (
        <h3
          key={status}
          id={`dashboard-status-${status}`}
          data-status={status}
          data-tab-color={getStatusColor(status, tabColorCycle)}
        >
          {statusLabels[status]}
          <span className="dashboard-count">
            {tabs.length + closedTabs.length}
          </span>
        </h3>
      ))}
    </div>
  );
}
