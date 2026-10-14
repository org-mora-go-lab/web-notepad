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
  columns.find((column) => column.status === "done")!.closedTabs =
    closedTabs.filter((entry) => entry.tab.content.trim());
  return columns;
}
