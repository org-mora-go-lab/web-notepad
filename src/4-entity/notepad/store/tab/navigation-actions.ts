import type { StateCreator } from "zustand";

import { ALL_GROUP_ID, UNGROUPED_GROUP_ID } from "../../constant";
import type { NotepadState } from "../../type";
import { assignTabToPane, getPaneTabs, setPaneActiveTabId } from "../../util";
import {
  activateTab,
  allocateTab,
  getActiveGroup,
  getTabGroup,
  updateGroup,
} from "../workspace";

type Actions = Pick<
  NotepadState,
  "addTab" | "selectTab" | "moveTab" | "moveTabs"
>;

export const createTabNavigationActions: StateCreator<
  NotepadState,
  [],
  [],
  Actions
> = (set, get) => ({
  addTab: (pane = "left") => {
    const state = get();
    // The All adds new tabs to Ungrouped.
    const inAllGroup = state.activeGroupId === ALL_GROUP_ID;
    const blank = inAllGroup ? state.groups.find(group => group.id === UNGROUPED_GROUP_ID)?.tabs.find(tab => tab.open && !tab.content.trim()) : undefined;
    if (blank) { state.selectTab(blank.id); return; }
    const group = inAllGroup
      ? state.groups.find((item) => item.id === UNGROUPED_GROUP_ID)
      : getActiveGroup(state);
    if (!group) return;
    const { tab, nextTabNumber } = allocateTab(state);
    // A pane that is not open falls back to the left pane.
    const target =
      !inAllGroup && getPaneTabs(group, pane).length > 0 ? pane : "left";
    const changes = updateGroup(state, group.id, (current) => {
      const next = assignTabToPane(
        { ...current, tabs: [...current.tabs, tab] },
        tab.id,
        target,
      );
      return {
        ...setPaneActiveTabId(next, target, tab.id),
        activePane: target,
      };
    });
    const allGroup = inAllGroup
      ? getActiveGroup({ ...state, ...changes })
      : null;
    const viewPane =
      allGroup && getPaneTabs(allGroup, pane).length > 0 ? pane : "left";
    set({
      ...changes,
      nextTabNumber,
      ...(allGroup
        ? updateGroup({ ...state, ...changes }, ALL_GROUP_ID, (current) => {
            const next = assignTabToPane(current, tab.id, viewPane);
            return {
              ...setPaneActiveTabId(next, viewPane, tab.id),
              activePane: viewPane,
            };
          })
        : {}),
    });
  },
  selectTab: (tabId) =>
    set((state) => {
      const owner = state.groups.find((group) =>
        group.tabs.some((tab) => tab.id === tabId),
      );
      if (!owner) return state;

      if (state.activeGroupId === ALL_GROUP_ID) {
        const reopened = updateGroup(state, owner.id, (current) => ({
          ...current,
          tabs: current.tabs.map((tab) =>
            tab.id === tabId ? { ...tab, open: true } : tab,
          ),
        }));
        const nextState = { ...state, ...reopened, allGroupActiveTabId: tabId };
        return {
          ...reopened,
          ...updateGroup(nextState, ALL_GROUP_ID, (current) =>
            activateTab(current, tabId),
          ),
        };
      }
      const group = getActiveGroup(state);
      if (!group || !group.tabs.some((tab) => tab.id === tabId)) return state;
      return updateGroup(state, group.id, (current) => {
        const reopened = {
          ...current,
          tabs: current.tabs.map((tab) =>
            tab.id === tabId ? { ...tab, open: true } : tab,
          ),
        };
        return activateTab(reopened, tabId);
      });
    }),
  moveTab: (fromTabId, toTabId) =>
    set((state) => {
      const group = getTabGroup(state, fromTabId);
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
  moveTabs: (tabIds, toTabId) =>
    set((state) => {
      const uniqueIds = [...new Set(tabIds)];
      const group = getTabGroup(state, uniqueIds[0] ?? "");
      if (!group || !group.tabs.some((tab) => tab.id === toTabId)) return state;
      const selected = new Set(uniqueIds);
      if (selected.has(toTabId)) return state;
      const moved = group.tabs.filter((tab) => selected.has(tab.id));
      if (moved.length === 0) return state;
      const targetIndex = group.tabs.findIndex((tab) => tab.id === toTabId);
      const selectedIndexes = group.tabs.flatMap((tab, index) =>
        selected.has(tab.id) ? [index] : [],
      );
      const selectedBeforeTarget = selectedIndexes.filter(
        (index) => index < targetIndex,
      ).length;
      const movingRight = selectedIndexes[0] < targetIndex;
      const remaining = group.tabs.filter((tab) => !selected.has(tab.id));
      const insertionIndex =
        targetIndex - selectedBeforeTarget + (movingRight ? 1 : 0);
      remaining.splice(
        Math.min(insertionIndex, remaining.length),
        0,
        ...moved,
      );
      return updateGroup(state, group.id, (current) => ({
        ...current,
        tabs: remaining,
      }));
    }),
});
