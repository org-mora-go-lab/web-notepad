"use client";

import { type PointerEvent as ReactPointerEvent, useCallback } from "react";

export type DividerOrientation = "vertical" | "horizontal";

// A vertical divider resizes widths (x ratio); a horizontal divider resizes heights (y ratio).
export function usePaneResize(
  onResize?: (ratio: number) => void,
  orientation: DividerOrientation = "vertical",
) {
  return useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!onResize) return;
      event.preventDefault();
      const container = event.currentTarget.parentElement;
      if (!container) return;

      const handleMove = (moveEvent: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        onResize(
          orientation === "horizontal"
            ? (moveEvent.clientY - rect.top) / rect.height
            : (moveEvent.clientX - rect.left) / rect.width,
        );
      };
      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [onResize, orientation],
  );
}
