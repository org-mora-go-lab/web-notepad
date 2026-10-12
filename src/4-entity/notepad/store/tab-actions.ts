import type { StateCreator } from "zustand";

import type { NotepadState } from "../type";
import {
  assignTabToPane,
  getPaneActiveTabId,
  getPaneColumn,
  getPaneOfTab,
  getPaneTabs,
  getTitleFromContent,
  normalizeLayout,
  sanitizeSelectedLines,
  setPaneActiveTabId,
} from "../util";
import {
  activateTab,
  allocateTab,
  EMPTY_SPLIT_LAYOUT,
  getActiveGroup,
  patchTabAndBookmark,
  updateGroup,
} from "./workspace";

type TabActions = Pick<
  NotepadState,
  | "addTab"
  | "selectTab"
  | "updateTab"
  | "setTabSelectedLines"
  | "moveTab"
  | "cycleTabColor"
  | "togglePin"
  | "closeTab"
>;

export const createTabActions: StateCreator<
  NotepadState,
  [],
  [],
  TabActions
> = (set, get) => ({
  addTab: (pane = "left") => {
    const state = get();
    const group = getActiveGroup(state);
    if (!group) return;
    const { tab, nextTabNumber } = allocateTab(state);
    // A pane that is not open falls back to the left pane.
    const target = getPaneTabs(group, pane).length > 0 ? pane : "left";
    const bottom = target === "left-bottom" || target === "right-bottom";
    const rowRatioKey = getPaneColumn(target) === "right" ? "rightRowRatio" : "leftRowRatio";

    set({
      ...updateGroup(state, group.id, (current) => {
        const next = assignTabToPane({ ...current, tabs: [...current.tabs, tab] }, tab.id, target);
        return {
          ...setPaneActiveTabId(next, target, tab.id),
          activePane: target,
          splitRatio: target === "right" ? 0.5 : current.splitRatio,
          [rowRatioKey]: bottom ? 0.5 : current[rowRatioKey],
        };
      }),
      nextTabNumber,
    });
  },
  selectTab: (tabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group || !group.tabs.some((tab) => tab.id === tabId)) return state;
      return updateGroup(state, group.id, (current) => activateTab(current, tabId));
    }),
  updateTab: (tabId, content) =>
    set((state) => {
      const group = getActiveGroup(state);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!tab) return state;

      const nextContent = typeof content === "string" ? content : "";
      const nextTitle = getTitleFromContent(nextContent, tab.title);
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(
          current,
          tabId,
          { title: nextTitle, content: nextContent, updatedAt: Date.now() },
          { title: nextTitle, content: nextContent, updatedAt: Date.now() },
        ),
      );
    }),
  setTabSelectedLines: (tabId, selectedLines) =>
    set((state) => {
      const group = getActiveGroup(state);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!group || !tab) return state;
      const nextLines = sanitizeSelectedLines(selectedLines, tab.content);
      if (nextLines.length === tab.selectedLines.length &&
          nextLines.every((line, index) => line === tab.selectedLines[index])) return state;
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(
          current,
          tabId,
          { selectedLines: nextLines },
          { selectedLines: [...nextLines], updatedAt: Date.now() },
        ),
      );
    }),
  moveTab: (fromTabId, toTabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      const from = group.tabs.findIndex((tab) => tab.id === fromTabId);
      const to = group.tabs.findIndex((tab) => tab.id === toTabId);
      if (from < 0 || to < 0 || from === to) return state;

      const tabs = [...group.tabs];
      const [moved] = tabs.splice(from, 1);
      tabs.splice(to, 0, moved);
      return updateGroup(state, group.id, (current) => ({
        ...current,
        tabs,
      }));
    }),
  cycleTabColor: (tabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!group || !tab) return state;
      const cycle = state.settings.tabColorCycle;
      // A color outside the cycle moves to the cycle's first color.
      const nextColor = cycle[(cycle.indexOf(tab.tabColor) + 1) % cycle.length];
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(current, tabId, { tabColor: nextColor }, { tabColor: nextColor, updatedAt: Date.now() }),
      );
    }),
  togglePin: (tabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      const tab = group.tabs.find((item) => item.id === tabId);
      if (!tab) return state;
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(current, tabId, { pinned: !tab.pinned }),
      );
    }),
  closeTab: (tabId) => {
    const state = get();
    const group = getActiveGroup(state);
    const tab = group?.tabs.find((item) => item.id === tabId);
    if (!tab || tab.pinned) return;
    if (tab.content) {
      set({
        closedTabs: [
          { id: `closed-${crypto.randomUUID()}`, groupId: group.id, tab, closedAt: Date.now() },
          ...state.closedTabs,
        ],
      });
    }

    const remainingTabs = group.tabs.filter((item) => item.id !== tabId);
    if (remainingTabs.length === 0) {
      const { tab: replacement, nextTabNumber } = allocateTab(state);
      set({
        ...updateGroup(state, group.id, (current) => ({
          ...current,
          ...EMPTY_SPLIT_LAYOUT,
          splitRatio: current.splitRatio,
          tabs: [replacement],
          activeTabId: replacement.id,
        })),
        nextTabNumber,
      });
      return;
    }

    const pane = getPaneOfTab(group, tabId);
    const paneIds = getPaneTabs(group, pane).map((item) => item.id);
    const closedIndex = paneIds.indexOf(tabId);
    const nextPaneIds = paneIds.filter((id) => id !== tabId);
    const fallbackId = nextPaneIds[Math.min(closedIndex, nextPaneIds.length - 1)] ?? null;

    set({
      ...updateGroup(state, group.id, (current) => {
        let next = assignTabToPane({ ...current, tabs: remainingTabs }, tabId, null);
        if (getPaneActiveTabId(current, pane) === tabId) {
          next = setPaneActiveTabId(next, pane, fallbackId);
        }
        // Closing a tab in a split pane keeps that pane active while it still has tabs.
        if (pane !== "left" && nextPaneIds.length > 0) next = { ...next, activePane: pane };
        return normalizeLayout(next);
      }),
    });
  },
});
