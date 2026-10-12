"use client";

import { useState } from "react";

import {
  getBottomPane,
  getPaneColumn,
  getPaneOfTab,
  getPaneTabs,
  type GroupEntry,
  type PaneId,
} from "@/src/4-entity/notepad";
import type { PaneDropZone } from "@/src/5-shared";

type Options = {
  group: GroupEntry | undefined;
  moveTabToPane: (tabId: string, pane: PaneId) => void;
};

export function usePaneDrag({ group, moveTabToPane }: Options) {
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const draggingPane =
    group && draggingTabId && group.tabs.some((tab) => tab.id === draggingTabId)
      ? getPaneOfTab(group, draggingTabId)
      : null;
  const countOf = (pane: PaneId) => (group ? getPaneTabs(group, pane).length : 0);

  const dropTo = (pane: PaneId) => () => {
    if (draggingTabId) moveTabToPane(draggingTabId, pane);
    setDraggingTabId(null);
  };

  const adoptTo = (pane: PaneId) => (tabId: string) => {
    moveTabToPane(tabId, pane);
    setDraggingTabId(null);
  };

  const dropZonesFor = (pane: PaneId): PaneDropZone[] => {
    if (!draggingPane) return [];
    const zones: PaneDropZone[] = [];
    if (draggingPane !== pane) {
      zones.push({ key: "adopt", label: "Move here", onDrop: dropTo(pane) });
    }
    // Splitting off the pane's only tab would leave the pane empty.
    if (draggingPane === pane && countOf(pane) < 2) return zones;

    const column = getPaneColumn(pane);
    if (column === "left" && countOf("right") === 0) {
      zones.push({ key: "split-right", label: "Split right", area: "right", onDrop: dropTo("right") });
    }
    const bottom = getBottomPane(column);
    if (pane !== bottom && countOf(bottom) === 0) {
      zones.push({ key: "split-down", label: "Split down", area: "bottom", onDrop: dropTo(bottom) });
    }
    return zones;
  };

  return { draggingTabId, setDraggingTabId, adoptTo, dropZonesFor };
}
