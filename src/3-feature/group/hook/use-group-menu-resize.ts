"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
} from "react";

const MIN_WIDTH = 240;
const VIEWPORT_MARGIN = 8;

export function useGroupMenuResize(
  menuRef: RefObject<HTMLDivElement | null>,
) {
  return useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const menu = menuRef.current;
      if (!menu) return;
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = menu.getBoundingClientRect().width;
      const handleMove = (moveEvent: PointerEvent) => {
        const maxWidth = window.innerWidth - VIEWPORT_MARGIN * 2;
        const width = Math.min(
          Math.max(startWidth + moveEvent.clientX - startX, MIN_WIDTH),
          maxWidth,
        );
        menu.style.width = `${Math.round(width)}px`;
        const left = Number.parseFloat(menu.style.left) || VIEWPORT_MARGIN;
        menu.style.left = `${Math.max(
          VIEWPORT_MARGIN,
          Math.min(left, window.innerWidth - width - VIEWPORT_MARGIN),
        )}px`;
      };
      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [menuRef],
  );
}
