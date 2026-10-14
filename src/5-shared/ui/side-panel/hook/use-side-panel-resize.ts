"use client";

import { type PointerEvent as ReactPointerEvent, useCallback, useEffect } from "react";

import {
  SIDE_PANEL_MIN_WIDTH,
  SIDE_PANEL_WIDTH_PROPERTY,
  SIDE_PANEL_WIDTH_STORAGE_KEY,
  WORKSPACE_MIN_WIDTH,
} from "../constant";

const clampWidth = (width: number) =>
  Math.round(
    Math.min(
      Math.max(width, SIDE_PANEL_MIN_WIDTH),
      Math.max(SIDE_PANEL_MIN_WIDTH, window.innerWidth - WORKSPACE_MIN_WIDTH),
    ),
  );

const applyWidth = (width: number) =>
  document.documentElement.style.setProperty(SIDE_PANEL_WIDTH_PROPERTY, `${width}px`);

// Drags the drawer's left edge; the width is shared by every panel and remembered.
export function useSidePanelResize() {
  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem(SIDE_PANEL_WIDTH_STORAGE_KEY));
      if (stored > 0) applyWidth(stored);
    } catch {
      // Storage is unavailable; keep the default width.
    }
  }, []);

  return useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const left = event.currentTarget.closest("[data-panel-position]")?.getAttribute("data-panel-position") === "left";
    let width: number | null = null;
    const handleMove = (moveEvent: PointerEvent) => {
      width = clampWidth(left ? moveEvent.clientX : window.innerWidth - moveEvent.clientX);
      applyWidth(width);
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      if (width === null) return;
      try {
        localStorage.setItem(SIDE_PANEL_WIDTH_STORAGE_KEY, String(width));
      } catch {
        // Storage is unavailable; the width lasts for this visit.
      }
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }, []);
}
