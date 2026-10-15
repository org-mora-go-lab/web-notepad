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

type Actions = Pick<NotepadState, "addTab" | "selectTab" | "moveTab">;

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
      if (state.activeGroupId === ALL_GROUP_ID) {
        const exists = state.groups.some((group) =>
          group.tabs.some((tab) => tab.id === tabId),
        );
        return exists
          ? updateGroup(state, ALL_GROUP_ID, (current) =>
              activateTab(current, tabId),
            )
          : state;
      }
      const group = getActiveGroup(state);
      if (!group || !group.tabs.some((tab) => tab.id === tabId)) return state;
      return updateGroup(state, group.id, (current) =>
        activateTab(current, tabId),
      );
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
});
