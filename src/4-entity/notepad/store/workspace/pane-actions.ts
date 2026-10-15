import type { StateCreator } from "zustand";

import { MAX_SPLIT_RATIO, MIN_SPLIT_RATIO } from "../../constant";
import type { NotepadState, PaneId } from "../../type";
import {
  assignTabToPane,
  getPaneActiveTabId,
  getPaneOfTab,
  getPaneTabs,
  normalizeLayout,
  setPaneActiveTabId,
} from "../../util";
import { getActiveGroup, getEditableGroup, updateGroup } from "./workspace";

type PaneActions = Pick<
  NotepadState,
  | "moveTabToPane"
  | "moveTabsToPane"
  | "setActivePane"
  | "setSplitRatio"
  | "setRowRatio"
>;

const clampRatio = (ratio: number) =>
  Math.min(MAX_SPLIT_RATIO, Math.max(MIN_SPLIT_RATIO, ratio));

export const createPaneActions: StateCreator<
  NotepadState,
  [],
  [],
  PaneActions
> = (set) => ({
  moveTabToPane: (tabId, pane) =>
    set((state) => {
      const group = getEditableGroup(state);
      if (!group || !group.tabs.some((tab) => tab.id === tabId)) return state;
      const fromPane = getPaneOfTab(group, tabId);
      if (fromPane === pane) return state;

      return updateGroup(state, group.id, (current) => {
        let next = assignTabToPane(current, tabId, pane);
        if (getPaneActiveTabId(current, fromPane) === tabId) {
          const remaining = getPaneTabs(next, fromPane);
          next = setPaneActiveTabId(
            next,
            fromPane,
            remaining[remaining.length - 1]?.id ?? null,
          );
        }
        next = setPaneActiveTabId(next, pane, tabId);
        return normalizeLayout({ ...next, activePane: pane });
      });
    }),
  moveTabsToPane: (tabIds, pane) =>
    set((state) => {
      const group = getEditableGroup(state);
      if (!group) return state;
      const selected = new Set(tabIds);
      const movedIds = group.tabs
        .filter((tab) => selected.has(tab.id))
        .map((tab) => tab.id);
      if (movedIds.length === 0) return state;
      const sourcePanes = new Set(
        movedIds.map((tabId) => getPaneOfTab(group, tabId)),
      );
      if (sourcePanes.size === 1 && sourcePanes.has(pane)) return state;

      return updateGroup(state, group.id, (current) => {
        let next = current;
        for (const tabId of movedIds) next = assignTabToPane(next, tabId, pane);
        for (const sourcePane of sourcePanes) {
          const activeId = getPaneActiveTabId(current, sourcePane);
          if (!activeId || !selected.has(activeId)) continue;
          const remaining = getPaneTabs(next, sourcePane);
          next = setPaneActiveTabId(
            next,
            sourcePane,
            remaining[remaining.length - 1]?.id ?? null,
          );
        }
        next = setPaneActiveTabId(next, pane, movedIds[movedIds.length - 1]);
        return normalizeLayout({ ...next, activePane: pane });
      });
    }),
  setActivePane: (pane: PaneId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      return updateGroup(state, group.id, (current) => ({
        ...current,
        activePane: getPaneTabs(current, pane).length > 0 ? pane : "left",
      }));
    }),
  setSplitRatio: (ratio) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      return updateGroup(state, group.id, (current) => ({
        ...current,
        splitRatio: clampRatio(ratio),
      }));
    }),
  setRowRatio: (column, ratio) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      return updateGroup(state, group.id, (current) => ({
        ...current,
        [column === "right" ? "rightRowRatio" : "leftRowRatio"]:
          clampRatio(ratio),
      }));
    }),
});
