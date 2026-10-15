"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
} from "react";

const MIN_WIDTH = 640;
const VIEWPORT_MARGIN = 32;

export function useGlobalSearchResize(
  dialogRef: RefObject<HTMLDialogElement | null>,
) {
  return useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const dialog = dialogRef.current;
      if (!dialog || window.matchMedia("(max-width: 640px)").matches) return;
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = dialog.getBoundingClientRect().width;
      const handleMove = (moveEvent: PointerEvent) => {
        const maxWidth = window.innerWidth - VIEWPORT_MARGIN;
        const width = Math.min(
          Math.max(startWidth + (moveEvent.clientX - startX) * 2, MIN_WIDTH),
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
    [dialogRef],
  );
}
