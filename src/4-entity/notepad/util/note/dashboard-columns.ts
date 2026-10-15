import { TAB_STATUSES } from "../../constant";
import type { NoteTab, TabColor, TabStatus } from "../../type";
import { getTabStatus } from "./note-tab";

export type DashboardColumnData = {
  status: TabStatus;
  tabs: NoteTab[];
};

export function getDashboardColumns(
  tabs: NoteTab[],
  colors: TabColor[],
): DashboardColumnData[] {
  const columns = TAB_STATUSES.map((status) => ({
    status,
    tabs: [] as NoteTab[],
  }));
  for (const tab of tabs) {
    if (!tab.content.trim()) continue;
    const column = columns.find(
      (item) => item.status === getTabStatus(tab, colors),
    );
    column?.tabs.push(tab);
  }
  return columns;
}
