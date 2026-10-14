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
  "moveTabToPane" | "setActivePane" | "setSplitRatio" | "setRowRatio"
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
