import { type DragEvent, useState } from "react";

import type { NoteTab, TabStatus } from "@/src/4-entity/notepad";

import type { DashboardProps } from "../type";

type Options = Pick<DashboardProps, "onChangeStatus"> & {
  visibleTabs: NoteTab[];
};

export function useDashboardDrag({
  visibleTabs,
  onChangeStatus,
}: Options) {
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TabStatus | null>(null);
  const endDrag = () => {
    setDraggingTabId(null);
    setOverStatus(null);
  };
  const startDrag = (tabId: string, event: DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", tabId);
    setDraggingTabId(tabId);
  };
  const moveToStatus = (itemId: string, status: TabStatus) => {
    if (visibleTabs.some((item) => item.id === itemId))
      onChangeStatus(itemId, status);
  };
  const drop = (status: TabStatus, event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (draggingTabId) moveToStatus(draggingTabId, status);
    endDrag();
  };
  return {
    draggingTabId,
    overStatus,
    setOverStatus,
    startDrag,
    moveToStatus,
    endDrag,
    drop,
  };
}
