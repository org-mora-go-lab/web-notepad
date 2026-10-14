import { type DragEvent, useState } from "react";

import type { NoteTab, TabStatus } from "@/src/4-entity/notepad";

import type { DashboardProps } from "../type";

type Options = Pick<
  DashboardProps,
  "onChangeStatus" | "onChangeClosedStatus" | "onUnpinTab"
> & { visibleTabs: NoteTab[] };

export function useDashboardDrag({
  visibleTabs,
  onChangeStatus,
  onChangeClosedStatus,
  onUnpinTab,
}: Options) {
  const [draggingItem, setDraggingItem] = useState<{
    id: string;
    closed: boolean;
  } | null>(null);
  const draggingTabId = draggingItem?.id ?? null;
  const [overStatus, setOverStatus] = useState<TabStatus | null>(null);
  const [pendingPinnedTabId, setPendingPinnedTabId] = useState<string | null>(
    null,
  );
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
  const drop = (status: TabStatus, event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (draggingItem?.closed) {
      if (status !== "done") onChangeClosedStatus(draggingItem.id, status);
    } else if (draggingTabId) {
      const dragged = visibleTabs.find((tab) => tab.id === draggingTabId);
      if (status === "done" && dragged?.pinned)
        setPendingPinnedTabId(draggingTabId);
      else onChangeStatus(draggingTabId, status);
    }
    endDrag();
  };
  const confirmClose = () => {
    if (!pendingPinnedTabId) return;
    onUnpinTab(pendingPinnedTabId);
    onChangeStatus(pendingPinnedTabId, "done");
    setPendingPinnedTabId(null);
  };
  return {
    draggingTabId,
    overStatus,
    setOverStatus,
    pendingPinnedTabId,
    startDrag,
    endDrag,
    drop,
    confirmClose,
    cancelClose: () => setPendingPinnedTabId(null),
  };
}
