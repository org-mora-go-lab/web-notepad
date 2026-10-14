import type { StateCreator } from "zustand";

import type { NotepadState } from "../../type";
import {
  assignTabToPane,
  getPaneActiveTabId,
  getPaneOfTab,
  getPaneTabs,
  getStatusColor,
  isSubstantialContent,
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

type Actions = Pick<NotepadState, "setTabStatus" | "closeTab">;

export const createTabLifecycleActions: StateCreator<
  NotepadState,
  [],
  [],
  Actions
> = (set, get) => ({
  // Moving a tab to a dashboard column gives it that column's tab color; the Closed column closes it without a prompt.
  setTabStatus: (tabId, status) => {
    set((state) => {
      const group = state.groups.find((item) =>
        item.tabs.some((tab) => tab.id === tabId),
      );
      if (!group) return state;
      const tabColor = getStatusColor(status, state.settings.tabColorCycle);
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(
          current,
          tabId,
          { tabColor },
          { tabColor, updatedAt: Date.now() },
        ),
      );
    });
    const state = get();
    const tab = getTabGroup(state, tabId)?.tabs.find(
      (item) => item.id === tabId,
    );
    if (status === "done" && tab) closeTabEntry(set, get, tabId, true);
  },
  closeTab: (tabId) => closeTabEntry(set, get, tabId, false),
});

// forceKeep keeps the tab in Closed regardless of its length or bookmark (dashboard Closed column).
const closeTabEntry = (
  set: (partial: Partial<NotepadState>) => void,
  get: () => NotepadState,
  tabId: string,
  forceKeep: boolean,
) => {
  const state = get();
  const group = getTabGroup(state, tabId);
  const tab = group?.tabs.find((item) => item.id === tabId);
  if (!group || !tab || tab.pinned) return;
  // A tab restored from Closed and left unedited goes back to Closed, whatever its length or bookmark.
  const unchangedSinceRestore =
    tab.restoredContent !== undefined && tab.content === tab.restoredContent;
  if (
    forceKeep ||
    unchangedSinceRestore ||
    (isSubstantialContent(tab.content) && !tab.bookmarked)
  ) {
    set({
      closedTabs: [
        {
          id: `closed-${crypto.randomUUID()}`,
          groupId: group.id,
          tab,
          closedAt: Date.now(),
        },
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
