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
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TabStatus | null>(null);
  const [pendingPinnedTabId, setPendingPinnedTabId] = useState<string | null>(
    null,
  );
  const endDrag = () => {
    setDraggingTabId(null);
    setOverStatus(null);
  };
  const startDrag = (tabId: string, event: DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", tabId);
    setDraggingTabId(tabId);
  };
  const drop = (status: TabStatus, event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (draggingTabId?.startsWith("closed-")) {
      if (status !== "done") onChangeClosedStatus(draggingTabId, status);
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
