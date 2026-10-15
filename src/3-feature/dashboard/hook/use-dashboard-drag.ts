import { type DragEvent, useState } from "react";

import type { NoteTab, TabStatus } from "@/src/4-entity/notepad";

import type { DashboardProps } from "../type";

type Options = Pick<
  DashboardProps,
  "onChangeStatus" | "onChangeClosedStatus"
> & { visibleTabs: NoteTab[] };

export function useDashboardDrag({
  visibleTabs,
  onChangeStatus,
  onChangeClosedStatus,
}: Options) {
  const [draggingItem, setDraggingItem] = useState<{
    id: string;
    closed: boolean;
  } | null>(null);
  const draggingTabId = draggingItem?.id ?? null;
  const [overStatus, setOverStatus] = useState<TabStatus | null>(null);
  const endDrag = () => {
    setDraggingItem(null);
    setOverStatus(null);
  };
  const startDrag = (
    tabId: string,
    closed: boolean,
    event: DragEvent<HTMLElement>,
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", tabId);
    setDraggingItem({ id: tabId, closed });
  };
  const moveToStatus = (
    itemId: string,
    closed: boolean,
    status: TabStatus,
  ) => {
    if (closed) {
      if (status !== "done") onChangeClosedStatus(itemId, status);
      return;
    }

    if (visibleTabs.some((item) => item.id === itemId))
      onChangeStatus(itemId, status);
  };
  const drop = (status: TabStatus, event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (draggingItem)
      moveToStatus(draggingItem.id, draggingItem.closed, status);
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
