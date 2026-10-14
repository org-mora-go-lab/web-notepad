import type { DividerOrientation } from "../hook";

export type PaneDividerProps = {
  orientation?: DividerOrientation;
  onResize: (ratio: number) => void;
};
