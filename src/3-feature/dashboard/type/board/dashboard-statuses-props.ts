import type { DashboardColumnData } from "@/src/4-entity/notepad";

import type { DashboardProps } from "..";

export type DashboardStatusesProps = Pick<
  DashboardProps,
  "tabColorCycle" | "statusNames" | "onRenameStatus"
> & {
  columns: DashboardColumnData[];
  iceboxVisible: boolean;
  closedVisible: boolean;
  iceboxCount: number;
  closedCount: number;
};
