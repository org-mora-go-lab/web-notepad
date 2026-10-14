"use client";

import { useI18n } from "@/src/5-shared/hook";

import { usePaneResize } from "../../hook";
import type { PaneDividerProps } from "../../type";

export function PaneDivider({
  orientation = "vertical",
  onResize,
}: PaneDividerProps) {
  const { t } = useI18n();
  const handlePointerDown = usePaneResize(onResize, orientation);

  return (
    <div
      className={`pane-divider ${orientation === "horizontal" ? "is-horizontal" : ""}`}
      role="separator"
      aria-orientation={orientation}
      aria-label={
        orientation === "horizontal"
          ? t.resizeHorizontalPanes
          : t.resizeVerticalPanes
      }
      onPointerDown={handlePointerDown}
    />
  );
}
