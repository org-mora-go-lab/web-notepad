import { ALL_GROUP_ID, ALL_GROUP_NAME } from "../constant";
import type {
  BookmarkEntry,
  GroupEntry,
  NotepadState,
  NoteTab,
  TabColor,
} from "../type";
import {
  createNoteTab,
  getNextTabNumber,
  getPaneOfTab,
  setPaneActiveTabId,
} from "../util";

// The All Group is not stored: it is built from every group's tabs, all in the left pane.
const buildAllGroup = (state: NotepadState): GroupEntry => {
  const tabs = state.groups.flatMap((group) => group.tabs);
  const activeTab = tabs.find((tab) => tab.id === state.allGroupActiveTabId) ?? tabs[0];
  return {
    id: ALL_GROUP_ID,
    name: ALL_GROUP_NAME,
    pinned: false,
    createdAt: 0,
    tabs,
    bookmarks: [],
    ...EMPTY_SPLIT_LAYOUT,
    activeTabId: activeTab?.id ?? "",
  };
};

export const getActiveGroup = (state: NotepadState) =>
  state.activeGroupId === ALL_GROUP_ID
    ? buildAllGroup(state)
    : state.groups.find((group) => group.id === state.activeGroupId) ?? state.groups[0];

// The group a tab edit applies to: the All Group lists tabs of every group, so a tab edit goes to its own group.
export const getTabGroup = (state: NotepadState, tabId: string) =>
  state.activeGroupId === ALL_GROUP_ID
    ? state.groups.find((group) => group.tabs.some((tab) => tab.id === tabId))
    : getActiveGroup(state);

// Pane layout only exists in a real group; the All Group keeps every tab in one pane.
export const getEditableGroup = (state: NotepadState) =>
  state.activeGroupId === ALL_GROUP_ID ? undefined : getActiveGroup(state);

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

// Applies a new tab color cycle. A tab's dashboard status follows its color's position in the cycle,
// so every tab (and bookmark / closed tab) keeps its position by taking the new color of that slot.
export const withTabColorCycle = (state: NotepadState, tabColorCycle: TabColor[]) => {
  const previous = state.settings.tabColorCycle;
  const recolor = (color: TabColor) => {
    const index = previous.indexOf(color);
    return index >= 0 && tabColorCycle[index] ? tabColorCycle[index] : color;
  };
  return {
    settings: { ...state.settings, tabColorCycle },
    groups: state.groups.map((group) => ({
      ...group,
      tabs: group.tabs.map((tab) => ({ ...tab, tabColor: recolor(tab.tabColor) })),
      bookmarks: group.bookmarks.map((bookmark) => ({ ...bookmark, tabColor: recolor(bookmark.tabColor) })),
    })),
    closedTabs: state.closedTabs.map((entry) => ({
      ...entry,
      tab: { ...entry.tab, tabColor: recolor(entry.tab.tabColor) },
    })),
  };
};
