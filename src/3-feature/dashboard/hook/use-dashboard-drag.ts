import { type DragEvent, useRef, useState } from "react";

import type { NoteTab, TabStatus } from "@/src/4-entity/notepad";

import type { DashboardProps } from "../type";

type Target = { id: string; placement: "before" | "after" };
type Options = Pick<DashboardProps, "onMoveCard"> & { visibleTabs: NoteTab[] };

export function useDashboardDrag({ visibleTabs, onMoveCard }: Options) {
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TabStatus | null>(null);
  const [overCard, setOverCard] = useState<Target | null>(null);
  const targetRef = useRef<Target | null>(null);
  const endedAtRef = useRef(-Infinity);
  const setCardTarget = (target: Target | null) => {
    targetRef.current = target;
    setOverCard(target);
  };
  const endDrag = () => {
    endedAtRef.current = performance.now();
    setDraggingTabId(null);
    setOverStatus(null);
    setCardTarget(null);
  };
  const startDrag = (tabId: string, event: DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", tabId);
    setDraggingTabId(tabId);
  };
  const moveToStatus = (
    tabId: string,
    status: TabStatus,
    target = targetRef.current,
  ) => {
    if (visibleTabs.some((tab) => tab.id === tabId))
      onMoveCard(tabId, status, target?.id, target?.placement);
  };
  return {
    isRecentDrag: () => performance.now() - endedAtRef.current < 500,
    draggingTabId,
    overStatus,
    overCard,
    setOverStatus,
    setCardTarget,
    startDrag,
    endDrag,
    moveToStatus,
    startTouchDrag: (tabId: string) => setDraggingTabId(tabId),
    touchOver: (
      status: TabStatus | null,
      id?: string,
      placement: "before" | "after" = "before",
    ) => {
      setOverStatus(status);
      setCardTarget(id ? { id, placement } : null);
    },
    touchDrop: (tabId: string, status: TabStatus | null) => {
      if (status) moveToStatus(tabId, status);
      endDrag();
    },
    drop: (
      status: TabStatus,
      event: DragEvent<HTMLElement>,
      target: Target | null = null,
    ) => {
      event.preventDefault();
      if (draggingTabId) moveToStatus(draggingTabId, status, target);
      endDrag();
    },
  };
}
