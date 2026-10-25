import type { StateCreator } from "zustand";

import type { NotepadState } from "../../type";
import {
  assignTabToPane,
  getPaneActiveTabId,
  getPaneOfTab,
  getPaneTabs,
  getStatusColor,
  normalizeLayout,
  setPaneActiveTabId,
} from "../../util";
import {
  allocateTab,
  EMPTY_SPLIT_LAYOUT,
  getTabGroup,
  patchTabAndBookmark,
  updateGroup,
} from "../workspace";

type Actions = Pick<
  NotepadState,
  "setTabStatus" | "closeTab" | "archiveTab" | "deleteTab"
>;

export const createTabLifecycleActions: StateCreator<
  NotepadState,
  [],
  [],
  Actions
> = (set, get) => ({
  // Dashboard columns describe status only; changing status never closes a tab.
  setTabStatus: (tabId, status) => {
    set((state) => {
      const group = state.groups.find((item) =>
        item.tabs.some((tab) => tab.id === tabId),
      );
      if (!group) return state;
      const auxiliary = status === "icebox" || status === "closed";
      const tabColor = auxiliary
        ? undefined
        : getStatusColor(status, state.settings.tabColorCycle);
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(
          current,
          tabId,
          { ...(tabColor ? { tabColor } : {}), dashboardStatus: auxiliary ? status : undefined },
          { ...(tabColor ? { tabColor } : {}), updatedAt: Date.now() },
        ),
      );
    });
  },
  closeTab: (tabId) => hideTabFromEditor(set, get, tabId),
  archiveTab: (tabId) => archiveTabEntry(set, get, tabId),
  deleteTab: (tabId) => deleteTabEntry(set, get, tabId),
});

const deleteTabEntry = (
  set: (partial: Partial<NotepadState>) => void,
  get: () => NotepadState,
  tabId: string,
) => {
  const state = get();
  const group = getTabGroup(state, tabId);
  const tab = group?.tabs.find((item) => item.id === tabId);
  if (!group || !tab) return;
  const remainingTabs = group.tabs.filter((item) => item.id !== tabId);
  if (!remainingTabs.some((item) => item.open)) {
    const { tab: replacement, nextTabNumber } = allocateTab(state);
    set({
      ...updateGroup(state, group.id, (current) => ({
        ...current,
        ...EMPTY_SPLIT_LAYOUT,
        splitRatio: current.splitRatio,
        tabs: [...remainingTabs, replacement],
        activeTabId: replacement.id,
      })),
      nextTabNumber,
    });
    return;
  }
  set(
    updateGroup(state, group.id, (current) =>
      normalizeLayout(
        assignTabToPane({ ...current, tabs: remainingTabs }, tabId, null),
      ),
    ),
  );
};

const hideTabFromEditor = (
  set: (partial: Partial<NotepadState>) => void,
  get: () => NotepadState,
  tabId: string,
) => {
  const state = get();
  const group = getTabGroup(state, tabId);
  const tab = group?.tabs.find((item) => item.id === tabId);
  if (!group || !tab || !tab.open) return;

  const pane = getPaneOfTab(group, tabId);
  const paneIds = getPaneTabs(group, pane).map((item) => item.id);
  const closedIndex = paneIds.indexOf(tabId);
  const nextPaneIds = paneIds.filter((id) => id !== tabId);
  const fallbackId =
    nextPaneIds[Math.min(closedIndex, nextPaneIds.length - 1)] ?? null;
  const remainingOpenTabs = group.tabs.filter(
    (item) => item.id !== tabId && item.open,
  );

  if (remainingOpenTabs.length === 0) {
    const { tab: replacement, nextTabNumber } = allocateTab(state);
    set({
      ...updateGroup(state, group.id, (current) => ({
        ...current,
        ...EMPTY_SPLIT_LAYOUT,
        splitRatio: current.splitRatio,
        tabs: [
          ...current.tabs.map((item) =>
            item.id === tabId ? { ...item, open: false } : item,
          ),
          replacement,
        ],
        activeTabId: replacement.id,
      })),
      nextTabNumber,
    });
    return;
  }

  set(
    updateGroup(state, group.id, (current) => {
      let next = assignTabToPane(
        {
          ...current,
          tabs: current.tabs.map((item) =>
            item.id === tabId ? { ...item, open: false } : item,
          ),
        },
        tabId,
        null,
      );
      if (getPaneActiveTabId(current, pane) === tabId) {
        next = setPaneActiveTabId(next, pane, fallbackId);
      }
      if (pane !== "left" && nextPaneIds.length > 0)
        next = { ...next, activePane: pane };
      return normalizeLayout(next);
    }),
  );
};

const archiveTabEntry = (
  set: (partial: Partial<NotepadState>) => void,
  get: () => NotepadState,
  tabId: string,
) => {
  const state = get();
  const group = getTabGroup(state, tabId);
  const tab = group?.tabs.find((item) => item.id === tabId);
  if (!group || !tab) return;
  set({
    closedTabs: [
      {
        id: `closed-${crypto.randomUUID()}`,
        groupId: group.id,
        tab: { ...tab, open: false },
        closedAt: Date.now(),
      },
      ...state.closedTabs,
    ],
  });

  const remainingTabs = group.tabs.filter((item) => item.id !== tabId);
  if (!remainingTabs.some((item) => item.open)) {
    const { tab: replacement, nextTabNumber } = allocateTab(state);
    set({
      ...updateGroup(state, group.id, (current) => ({
        ...current,
        ...EMPTY_SPLIT_LAYOUT,
        splitRatio: current.splitRatio,
        tabs: [...remainingTabs, replacement],
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
  const fallbackId =
    nextPaneIds[Math.min(closedIndex, nextPaneIds.length - 1)] ?? null;

  set({
    ...updateGroup(state, group.id, (current) => {
      let next = assignTabToPane(
        { ...current, tabs: remainingTabs },
        tabId,
        null,
      );
      if (getPaneActiveTabId(current, pane) === tabId) {
        next = setPaneActiveTabId(next, pane, fallbackId);
      }
      // Closing a tab in a split pane keeps that pane active while it still has tabs.
      if (pane !== "left" && nextPaneIds.length > 0)
        next = { ...next, activePane: pane };
      return normalizeLayout(next);
    }),
  });
};
