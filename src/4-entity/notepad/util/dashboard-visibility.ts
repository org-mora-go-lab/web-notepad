import type { DashboardVisibility } from "../type";

export const DEFAULT_DASHBOARD_VISIBILITY: DashboardVisibility = {
  icebox: false,
  done: true,
};

export function normalizeDashboardVisibility(
  value: unknown,
): DashboardVisibility {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return DEFAULT_DASHBOARD_VISIBILITY;
  }
  const source = value as Record<string, unknown>;
  return {
    icebox: source.icebox === true,
    done: source.done !== false,
  };
}
