import type { NoteTab } from "../../type";

export function compareDashboardCards(left: NoteTab, right: NoteTab) {
  const rank = (tab: NoteTab) =>
    typeof tab.dashboardOrder === "number" &&
    Number.isFinite(tab.dashboardOrder)
      ? tab.dashboardOrder
      : Number.MAX_SAFE_INTEGER;
  return (
    rank(left) - rank(right) ||
    Number(right.bookmarked) - Number(left.bookmarked) ||
    left.id.localeCompare(right.id)
  );
}
