type SnapshotTab = {
  id: string;
  content: string;
  open?: boolean;
};

type SnapshotGroup = {
  tabs: SnapshotTab[];
  bookmarks?: { sourceTabId: string }[];
};

type SnapshotState = {
  groups: SnapshotGroup[];
  closedTabs: { tab: SnapshotTab }[];
  [key: string]: unknown;
};

const persistable = (tab: SnapshotTab) =>
  tab.open !== false && tab.content.trim().length >= 3;

/** Removes transient/closed notes before a personal snapshot reaches Turso. */
export function sanitizeCloudSnapshot(snapshot: string) {
  const state = JSON.parse(snapshot) as SnapshotState;
  state.groups = state.groups.map((group) => {
    const tabs = group.tabs.filter(persistable);
    const tabIds = new Set(tabs.map((tab) => tab.id));
    return {
      ...group,
      tabs,
      bookmarks: group.bookmarks?.filter((bookmark) =>
        tabIds.has(bookmark.sourceTabId),
      ),
    };
  });
  state.closedTabs = state.closedTabs.filter(
    (entry) => entry.tab.content.trim().length >= 3,
  );
  return JSON.stringify(state);
}
