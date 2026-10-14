import type { PaneColumn } from "@/src/4-entity/notepad";

import type { PaneViewProps } from "./pane-view-props";

// A left or right column with a top pane and an optional bottom pane.
export type PaneColumnProps = {
  column: PaneColumn;
  panes: PaneViewProps[];
  widthRatio?: number;
  rowRatio: number;
  onResize?: (ratio: number) => void;
  onRowResize: (ratio: number) => void;
};
