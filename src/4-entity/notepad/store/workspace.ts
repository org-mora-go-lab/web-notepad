import type {
  BookmarkEntry,
  GroupEntry,
  NotepadState,
  NoteTab,
} from "../type";
import {
  createNoteTab,
  getNextTabNumber,
  getPaneOfTab,
  setPaneActiveTabId,
} from "../util";

export const getActiveGroup = (state: NotepadState) =>
  state.groups.find((group) => group.id === state.activeGroupId) ?? state.groups[0];

export const updateGroup = (
  state: NotepadState,
  groupId: string,
  update: (group: GroupEntry) => GroupEntry,
) => ({
  groups: state.groups.map((group) =>
    group.id === groupId ? update(group) : group,
  ),
});

const getAllTabs = (state: NotepadState) =>
  state.groups.flatMap((group) => group.tabs);

const getReservedTabIds = (state: NotepadState) =>
  state.groups.flatMap((group) =>
    group.bookmarks.map((bookmark) => bookmark.sourceTabId),
  );

export const allocateTab = (state: NotepadState) => {
  const number = getNextTabNumber(
    getAllTabs(state),
    getReservedTabIds(state),
    state.nextTabNumber,
  );
  return {
    tab: createNoteTab(number, state.settings.tabColorCycle[0]),
    number,
    nextTabNumber: number + 1,
  };
};

// Pane fields of a workspace with every tab in the left pane.
export const EMPTY_SPLIT_LAYOUT = {
  rightTabIds: [],
  activeRightTabId: null,
  leftBottomTabIds: [],
  activeLeftBottomTabId: null,
  rightBottomTabIds: [],
  activeRightBottomTabId: null,
  activePane: "left",
  splitRatio: 0.5,
  leftRowRatio: 0.5,
  rightRowRatio: 0.5,
} satisfies Partial<GroupEntry>;

export const createGroupEntry = (
  id: string,
  name: string,
  createdAt: number,
  tab: NoteTab,
): GroupEntry => ({
  id,
  name,
  pinned: false,
  createdAt,
  tabs: [tab],
  bookmarks: [],
  ...EMPTY_SPLIT_LAYOUT,
  activeTabId: tab.id,
});

export const activateTab = (group: GroupEntry, tabId: string): GroupEntry => {
  const pane = getPaneOfTab(group, tabId);
  return { ...setPaneActiveTabId(group, pane, tabId), activePane: pane };
};

// Applies the same change to a tab and the bookmark linked to it.
export const patchTabAndBookmark = (
  group: GroupEntry,
  tabId: string,
  tabPatch: Partial<NoteTab>,
  bookmarkPatch: Partial<BookmarkEntry> = {},
): GroupEntry => ({
  ...group,
  tabs: group.tabs.map((tab) =>
    tab.id === tabId ? { ...tab, ...tabPatch } : tab,
  ),
  bookmarks: group.bookmarks.map((bookmark) =>
    bookmark.sourceTabId === tabId ? { ...bookmark, ...bookmarkPatch } : bookmark,
  ),
});
