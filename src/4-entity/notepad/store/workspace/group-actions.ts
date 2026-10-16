import type { StateCreator } from "zustand";

import { ALL_GROUP_ID, UNGROUPED_GROUP_ID } from "../../constant";
import type { NotepadState } from "../../type";
import { assignTabToPane, normalizeDashboardStatusNames, normalizeLayout } from "../../util";
import { allocateTab, createGroupEntry } from "./workspace";

type GroupActions = Pick<
  NotepadState,
  | "createGroup"
  | "renameGroup"
  | "setGroupStatusNames"
  | "toggleGroupPin"
  | "removeGroup"
  | "selectGroup"
  | "moveTabToGroup"
>;

export const createGroupActions: StateCreator<
  NotepadState,
  [],
  [],
  GroupActions
> = (set, get) => ({
  setGroupStatusNames: (groupId, names) => set((state) => {
    if (groupId === ALL_GROUP_ID || !state.groups.some((group) => group.id === groupId)) return state;
    return {
      groups: state.groups.map((group) => group.id === groupId
        ? { ...group, dashboardStatusNames: normalizeDashboardStatusNames(names), updatedAt: Date.now() }
        : group),
    };
  }),
  moveTabToGroup: (tabId, groupId) =>
    set((state) => {
      const source = state.groups.find((group) =>
        group.tabs.some((tab) => tab.id === tabId),
      );
      const target = state.groups.find((group) => group.id === groupId);
      const tab = source?.tabs.find((item) => item.id === tabId);
      if (!source || !target || !tab || source.id === target.id) return state;

      let remainingTabs = source.tabs.filter((item) => item.id !== tabId);
      let nextTabNumber = state.nextTabNumber;
      if (remainingTabs.length === 0) {
        const allocated = allocateTab(state);
        remainingTabs = [allocated.tab];
        nextTabNumber = allocated.nextTabNumber;
      }

      const linkedBookmarks = source.bookmarks.filter(
        (bookmark) => bookmark.sourceTabId === tabId,
      );
      const updatedAt = Date.now();

      return {
        nextTabNumber,
        groups: state.groups.map((group) => {
          if (group.id === source.id) {
            return normalizeLayout(
              assignTabToPane(
                {
                  ...group,
                  tabs: remainingTabs,
                  bookmarks: group.bookmarks.filter(
                    (bookmark) => bookmark.sourceTabId !== tabId,
                  ),
                  updatedAt,
                },
                tabId,
                null,
              ),
            );
          }
          if (group.id === target.id) {
            return {
              ...group,
              tabs: [...group.tabs, tab],
              bookmarks: [...group.bookmarks, ...linkedBookmarks],
              activeTabId: tabId,
              activePane: "left",
              updatedAt,
            };
          }
          return group;
        }),
      };
    }),
  createGroup: (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const state = get();
    const { tab, nextTabNumber } = allocateTab(state);
    const id = `group-${crypto.randomUUID()}`;
    set({
      groups: [
        ...state.groups,
        createGroupEntry(id, trimmedName, Date.now(), tab),
      ],
      activeGroupId: id,
      nextTabNumber,
    });
  },
  renameGroup: (groupId, name) =>
    set((state) => {
      const trimmedName = name.trim().slice(0, 60);
      if (groupId === UNGROUPED_GROUP_ID || !trimmedName) return state;
      return {
        groups: state.groups.map((group) =>
          group.id === groupId
            ? { ...group, name: trimmedName, updatedAt: Date.now() }
            : group,
        ),
      };
    }),
  toggleGroupPin: (groupId) =>
    set((state) => {
      if (groupId === UNGROUPED_GROUP_ID) return state;
      return {
        groups: state.groups.map((group) =>
          group.id === groupId
            ? { ...group, pinned: !group.pinned, updatedAt: Date.now() }
            : group,
        ),
      };
    }),
  removeGroup: (groupId) =>
    set((state) => {
      if (groupId === UNGROUPED_GROUP_ID) return state;
      const removedGroup = state.groups.find((group) => group.id === groupId);
      const ungrouped = state.groups.find(
        (group) => group.id === UNGROUPED_GROUP_ID,
      );
      if (!removedGroup || !ungrouped) return state;

      const nextUngrouped = {
        ...ungrouped,
        tabs: [...ungrouped.tabs, ...removedGroup.tabs],
        bookmarks: [...ungrouped.bookmarks, ...removedGroup.bookmarks],
        activeTabId:
          state.activeGroupId === groupId
            ? removedGroup.activeTabId
            : ungrouped.activeTabId,
        activePane:
          state.activeGroupId === groupId
            ? ("left" as const)
            : ungrouped.activePane,
        updatedAt: Date.now(),
      };
      return {
        groups: state.groups
          .filter((group) => group.id !== groupId)
          .map((group) =>
            group.id === UNGROUPED_GROUP_ID ? nextUngrouped : group,
          ),
        activeGroupId:
          state.activeGroupId === groupId
            ? UNGROUPED_GROUP_ID
            : state.activeGroupId,
      };
    }),
  selectGroup: (groupId) =>
    set((state) =>
      groupId === ALL_GROUP_ID ||
      state.groups.some((group) => group.id === groupId)
        ? { activeGroupId: groupId }
        : state,
    ),
});
