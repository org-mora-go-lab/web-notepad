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
  moveTabsToPane: (tabIds: string[], pane: PaneId) => void;
  splitTabsLeft: (tabIds: string[], pane: PaneId) => void;
};

export function usePaneDrag({ group, moveTabsToPane, splitTabsLeft }: Options) {
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const [draggingTabIds, setDraggingTabIds] = useState<string[]>([]);
  const [selectedTabIds, setSelectedTabIds] = useState<string[]>([]);
  const [selectionAnchorId, setSelectionAnchorId] = useState<string | null>(
    null,
  );
  const draggingPane =
    group && draggingTabId && group.tabs.some((tab) => tab.id === draggingTabId)
      ? getPaneOfTab(group, draggingTabId)
      : null;
  const countOf = (pane: PaneId) =>
    group ? getPaneTabs(group, pane).length : 0;

  const selectTabRange = (
    tabs: GroupEntry["tabs"],
    tabId: string,
    extend: boolean,
  ) => {
    if (!extend || !selectionAnchorId) {
      setSelectionAnchorId(tabId);
      setSelectedTabIds([tabId]);
      return;
    }
    const anchorIndex = tabs.findIndex((tab) => tab.id === selectionAnchorId);
    const targetIndex = tabs.findIndex((tab) => tab.id === tabId);
    if (anchorIndex < 0 || targetIndex < 0) {
      setSelectionAnchorId(tabId);
      setSelectedTabIds([tabId]);
      return;
    }
    const [start, end] = [anchorIndex, targetIndex].sort((a, b) => a - b);
    setSelectedTabIds(tabs.slice(start, end + 1).map((tab) => tab.id));
  };

  const startDrag = (tabId: string) => {
    const pane = group ? getPaneOfTab(group, tabId) : null;
    const ids =
      group && pane && selectedTabIds.includes(tabId)
        ? group.tabs
            .filter(
              (tab) =>
                selectedTabIds.includes(tab.id) &&
                getPaneOfTab(group, tab.id) === pane,
            )
            .map((tab) => tab.id)
        : [tabId];
    setDraggingTabId(tabId);
    setDraggingTabIds(ids);
  };

  const endDrag = () => {
    setDraggingTabId(null);
    setDraggingTabIds([]);
  };

  const dropTo = (pane: PaneId) => () => {
    if (draggingTabIds.length > 0) moveTabsToPane(draggingTabIds, pane);
    endDrag();
  };

  const adoptTo = (pane: PaneId) => (tabId: string) => {
    const ids = draggingTabIds.includes(tabId) ? draggingTabIds : [tabId];
    moveTabsToPane(ids, pane);
    endDrag();
  };

  const dropZonesFor = (pane: PaneId): PaneDropZone[] => {
    if (!draggingPane) return [];
    const zones: PaneDropZone[] = [];
    if (draggingPane !== pane) {
      zones.push({ key: "adopt", label: "Move here", onDrop: dropTo(pane) });
      // Moving from the right column back into an existing left editor must not split it.
      if (
        getPaneColumn(draggingPane) === "right" &&
        getPaneColumn(pane) === "left"
      )
        return zones;
    }
    // Splitting requires another tab to remain in the source pane, including cross-pane drops.
    if (countOf(draggingPane) - draggingTabIds.length < 1) return zones;

    const column = getPaneColumn(pane);
    const rightTarget =
      pane === "left-bottom" && countOf("right") > 0 ? "right-bottom" : "right";
    if (column === "left" && countOf(rightTarget) === 0) {
      if (draggingPane === pane)
        zones.push({
          key: "split-left",
          label: "Split left",
          area: "left",
          onDrop: () => {
            splitTabsLeft(draggingTabIds, pane);
            endDrag();
          },
        });
      zones.push({
        key: "split-right",
        label: "Split right",
        area: "right",
        onDrop: dropTo(rightTarget),
      });
    }
    const bottom = getBottomPane(column);
    if (pane !== bottom && countOf(bottom) === 0) {
      zones.push({
        key: "split-down",
        label: "Split down",
        area: "bottom",
        onDrop: dropTo(bottom),
      });
    }
    return zones;
  };

  return {
    draggingTabId,
    draggingTabIds,
    selectedTabIds,
    selectTabRange,
    startDrag,
    endDrag,
    adoptTo,
    dropZonesFor,
  };
}
