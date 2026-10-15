import type { DashboardColumnData } from "@/src/4-entity/notepad";

import type { useDashboardDrag } from "../../hook";
import type { DashboardProps } from "..";

export type DashboardColumnProps = Pick<
  DashboardProps,
  | "activeTabId"
  | "groups"
  | "showGroupNames"
  | "tabColorCycle"
  | "onOpenTab"
> & {
  column: DashboardColumnData;
  drag: ReturnType<typeof useDashboardDrag>;
  onOpenContextMenu: (
    itemId: string,
    clientX: number,
    clientY: number,
  ) => void;
};
