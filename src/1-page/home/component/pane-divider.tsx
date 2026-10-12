"use client";

import { type DividerOrientation, usePaneResize } from "../hook";

type Props = {
  orientation?: DividerOrientation;
  onResize: (ratio: number) => void;
};

export function PaneDivider({ orientation = "vertical", onResize }: Props) {
  const handlePointerDown = usePaneResize(onResize, orientation);

  return (
    <div
      className={`pane-divider ${orientation === "horizontal" ? "is-horizontal" : ""}`}
      role="separator"
      aria-orientation={orientation}
      aria-label={orientation === "horizontal" ? "상하 크기 조절" : "영역 크기 조절"}
      onPointerDown={handlePointerDown}
    />
  );
}
