"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
} from "react";

const MIN_WIDTH = 640;
const VIEWPORT_MARGIN = 32;

export function useDialogHorizontalResize(
  dialogRef: RefObject<HTMLDialogElement | null>,
  {
    minWidth = MIN_WIDTH,
    viewportMargin = VIEWPORT_MARGIN,
    centered = true,
  } = {},
) {
  return useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const dialog = dialogRef.current;
      if (!dialog || window.matchMedia("(max-width: 512px)").matches) return;
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = dialog.getBoundingClientRect().width;
      const handleMove = (moveEvent: PointerEvent) => {
        const maxWidth = window.innerWidth - viewportMargin;
        const width = Math.min(
          Math.max(
            startWidth + (moveEvent.clientX - startX) * (centered ? 2 : 1),
            minWidth,
          ),
          maxWidth,
        );
        dialog.style.width = `${Math.round(width)}px`;
      };
      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [dialogRef, minWidth, viewportMargin, centered],
  );
}
