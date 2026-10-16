import type { Language } from "@/src/5-shared/type";

export type TabColor =
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "indigo"
  | "purple"
  | "pink";

export type NotepadSettings = {
  // Multiplier applied to every font size in the app.
  fontScale: number;
  // Colors the tab color icon cycles through; the first one is the new-tab color.
  tabColorCycle: TabColor[];
  language: Language;
  // Right panels slide in and out; off shows and hides them in place.
  panelSlide: boolean;
  panelPosition: "left" | "right";
};

// Dashboard column; it is derived from the tab color: 1st / 2nd / 3rd color of the tab color cycle.
export type TabStatus = "icebox" | "todo" | "in-progress" | "done" | "closed";
export type DashboardStatusNames = Partial<Record<TabStatus, string>>;

export type NoteTab = {
  id: string;
  // Closed editor tabs remain in their dashboard status until reopened.
  open: boolean;
  title: string;
  content: string;
  savedContent: string;
  selectedLines: number[];
  tabColor: TabColor;
  // Icebox and Closed are explicit states; legacy tabs derive the three core states from color.
  dashboardStatus?: TabStatus;
  pinned: boolean;
  bookmarked: boolean;
  updatedAt: number;
};

export type BookmarkEntry = {
  id: string;
  sourceTabId: string;
  title: string;
  content: string;
  tabColor: TabColor;
  selectedLines: number[];
  createdAt: number;
  // Last time the bookmark was created or synced from its source tab.
  updatedAt: number;
};

// A tab hidden from the editor and available from the Closed panel.
export type ClosedTabEntry = {
  id: string;
  groupId: string;
  tab: NoteTab;
  closedAt: number;
};

export type GroupEntry = {
  dashboardStatusNames?: DashboardStatusNames;
  id: string;
  name: string;
  // Pinned groups sort first in the group lists.
  pinned: boolean;
  createdAt: number;
  // Last time the group itself or its tab membership changed.
  updatedAt: number;
  tabs: NoteTab[];
  bookmarks: BookmarkEntry[];
  activeTabId: string;
  rightTabIds: string[];
  activeRightTabId: string | null;
  leftBottomTabIds: string[];
  activeLeftBottomTabId: string | null;
  rightBottomTabIds: string[];
  activeRightBottomTabId: string | null;
  activePane: PaneId;
  splitRatio: number;
  leftRowRatio: number;
  rightRowRatio: number;
};

// "left" and "right" are the top panes; each column can add a bottom pane.
export type PaneId = "left" | "right" | "left-bottom" | "right-bottom";

export type PaneColumn = "left" | "right";

export type PaneLayout = Omit<GroupEntry, "id" | "name" | "pinned" | "createdAt" | "updatedAt" | "tabs" | "bookmarks" | "dashboardStatusNames">;

export type NotepadState = {
  nextTabNumber: number;
  groups: GroupEntry[];
  activeGroupId: string;
  closedTabs: ClosedTabEntry[];
  // All keeps its view layout separate from the tabs' owning groups.
  allGroupActiveTabId: string | null;
  allGroupLayout: PaneLayout | null;
  settings: NotepadSettings;
  setFontScale: (fontScale: number) => void;
  setTabColorCycleColor: (index: number, color: TabColor) => void;
  setLanguage: (language: Language) => void;
  setPanelSlide: (panelSlide: boolean) => void;
  setPanelPosition: (panelPosition: "left" | "right") => void;
  resetSettings: () => void;
  resetTabColorCycle: () => void;
  shuffleTabColorCycle: () => void;
  addTab: (pane?: PaneId) => void;
  selectTab: (tabId: string) => void;
  updateTab: (tabId: string, content: string) => void;
  setTabSelectedLines: (tabId: string, selectedLines: number[]) => void;
  moveTab: (fromTabId: string, toTabId: string) => void;
  moveTabs: (tabIds: string[], toTabId: string) => void;
  moveTabToPane: (tabId: string, pane: PaneId) => void;
  moveTabsToPane: (tabIds: string[], pane: PaneId) => void;
  moveTabToGroup: (tabId: string, groupId: string) => void;
  setActivePane: (pane: PaneId) => void;
  setSplitRatio: (ratio: number) => void;
  setRowRatio: (column: PaneColumn, ratio: number) => void;
  cycleTabColor: (tabId: string) => void;
  togglePin: (tabId: string) => void;
  setTabStatus: (tabId: string, status: TabStatus) => void;
  toggleBookmark: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  archiveTab: (tabId: string) => void;
  deleteTab: (tabId: string) => void;
  openBookmark: (bookmarkId: string) => void;
  removeBookmark: (bookmarkId: string) => void;
  createGroup: (name: string) => void;
  renameGroup: (groupId: string, name: string) => void;
  setGroupStatusNames: (groupId: string, names: DashboardStatusNames) => void;
  toggleGroupPin: (groupId: string) => void;
  removeGroup: (groupId: string) => void;
  selectGroup: (groupId: string) => void;
  restoreClosedTab: (entryId: string) => void;
  moveClosedTabToStatus: (entryId: string, status: TabStatus) => void;
  moveClosedTabToGroup: (entryId: string, groupId: string) => void;
  toggleClosedTabBookmark: (entryId: string) => void;
  removeClosedTab: (entryId: string) => void;
};
