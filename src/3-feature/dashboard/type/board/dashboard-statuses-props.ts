import type { DashboardColumnData } from "@/src/4-entity/notepad";

import type { DashboardProps } from "..";

export type DashboardStatusesProps = Pick<
  DashboardProps,
  "tabColorCycle" | "statusNames"
> & {
  columns: DashboardColumnData[];
  iceboxVisible: boolean;
  iceboxCount: number;
};
