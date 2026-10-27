import type { NoteTab } from "../../type";

export function compareDashboardCards(left: NoteTab, right: NoteTab) {
  return (
    (left.dashboardOrder ?? Number.MAX_SAFE_INTEGER) -
      (right.dashboardOrder ?? Number.MAX_SAFE_INTEGER) ||
    Number(right.bookmarked) - Number(left.bookmarked) ||
    left.id.localeCompare(right.id)
  );
}
