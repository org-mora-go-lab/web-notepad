import { TAB_STATUSES } from "../../constant";
import type { ClosedTabEntry, NoteTab, TabColor, TabStatus } from "../../type";
import { getTabStatus } from "./note-tab";

export type DashboardColumnData = {
  status: TabStatus;
  tabs: NoteTab[];
  closedTabs: ClosedTabEntry[];
};

export function getDashboardColumns(
  tabs: NoteTab[],
  closedTabs: ClosedTabEntry[],
  colors: TabColor[],
): DashboardColumnData[] {
  const columns = TAB_STATUSES.map((status) => ({
    status,
    tabs: [] as NoteTab[],
    closedTabs: [] as ClosedTabEntry[],
  }));
  for (const tab of tabs) {
    if (tab.content.trim())
      columns
        .find((column) => column.status === getTabStatus(tab, colors))!
        .tabs.push(tab);
  }
  for (const entry of closedTabs) {
    if (entry.tab.content.trim())
      columns
        .find(
          (column) => column.status === getTabStatus(entry.tab, colors),
        )!
        .closedTabs.push(entry);
  }
  return columns;
}
