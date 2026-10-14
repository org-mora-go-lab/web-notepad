"use client";

import { type RefObject, useMemo, useRef } from "react";

import type { PaneId } from "@/src/4-entity/notepad";

export type PaneRefs<T> = Record<PaneId, RefObject<T>>;

// One ref per pane, stable across renders.
export function usePaneRefs<T>(initialValue: T): PaneRefs<T> {
  const left = useRef(initialValue);
  const right = useRef(initialValue);
  const leftBottom = useRef(initialValue);
  const rightBottom = useRef(initialValue);
  return useMemo(
    () => ({
      left,
      right,
      "left-bottom": leftBottom,
      "right-bottom": rightBottom,
    }),
    [],
  );
}
