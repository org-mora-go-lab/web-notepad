import { DASHBOARD_STATUSES } from "../constant";
import type { DashboardStatusNames } from "../type";

export function normalizeDashboardStatusNames(
  value: unknown,
): DashboardStatusNames {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  return Object.fromEntries(
    DASHBOARD_STATUSES.flatMap((status) => {
      const name = source[status];
      return typeof name === "string" && name.trim()
        ? [[status, name.trim().slice(0, 30)]]
        : [];
    }),
  );
}
