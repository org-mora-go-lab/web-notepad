import { ALL_GROUP_ID, UNGROUPED_GROUP_ID } from "../constant";
import type { NotepadState, NoteTab } from "../type";
import { createNoteTab } from "../util";
import { normalizeAllGroupLayout } from "./normalize-all-group-layout";
import { normalizeGroups } from "./normalize-groups";
import {
  normalizeBookmarks,
  normalizeClosedTabs,
  normalizeTabs,
} from "./normalize-records";
import { normalizeSettings } from "./normalize-settings";
import { finiteNumberOr } from "./read-value";

export function normalizePersistedState(
  persistedState: unknown,
  currentState: NotepadState,
): NotepadState {
  const persisted = {
    ...(persistedState as Partial<NotepadState> & {
      tabs?: unknown;
      bookmarks?: unknown;
      activeTabId?: unknown;
      rightTabIds?: unknown;
      activeRightTabId?: unknown;
      activePane?: unknown;
      splitRatio?: unknown;
      unsavedSnapshots?: unknown;
      nextUnsavedNumber?: unknown;
    }),
  };
  delete persisted.unsavedSnapshots;
  delete persisted.nextUnsavedNumber;
  const settings = normalizeSettings(persisted.settings);
  const hasLegacyTabs = Array.isArray(persisted.tabs);
  const legacyTabs = normalizeTabs(persisted.tabs, currentState.groups[0].tabs);
  const legacyBookmarks = normalizeBookmarks(
    persisted.bookmarks,
    currentState.groups[0].bookmarks,
  );
  const sourceGroups = Array.isArray(persisted.groups)
    ? persisted.groups
    : currentState.groups;
  let nextTabNumber = finiteNumberOr(
    persisted.nextTabNumber,
    currentState.nextTabNumber,
  );
  const reservedTabIds = new Set([
    ...legacyTabs.map((tab) => tab.id),
    ...legacyBookmarks.map((bookmark) => bookmark.sourceTabId),
    ...sourceGroups.flatMap((group) =>
      Array.isArray(group.tabs)
        ? group.tabs
            .filter((tab) => tab && typeof tab.id === "string")
            .map((tab) => tab.id)
        : [],
    ),
  ]);
  while (reservedTabIds.has(`tab-${nextTabNumber}`)) nextTabNumber += 1;

  const groups = normalizeGroups(
    sourceGroups,
    { fields: persisted, tabs: legacyTabs, bookmarks: legacyBookmarks },
    createLegacyGroupTab,
  );

  const ungrouped = groups.find((group) => group.id === UNGROUPED_GROUP_ID);
  if (!ungrouped) {
    groups.unshift({
      ...currentState.groups[0],
      tabs:
        hasLegacyTabs && legacyTabs.length > 0
          ? legacyTabs
          : [createLegacyGroupTab()],
      bookmarks: legacyBookmarks,
    });
  }

  const requestedActiveGroupId = persisted.activeGroupId;
  const activeGroupId =
    typeof requestedActiveGroupId === "string" &&
    (requestedActiveGroupId === ALL_GROUP_ID ||
      groups.some((group) => group.id === requestedActiveGroupId))
      ? requestedActiveGroupId
      : UNGROUPED_GROUP_ID;
  delete persisted.tabs;
  delete persisted.bookmarks;
  delete persisted.activeTabId;
  delete persisted.rightTabIds;
  delete persisted.activeRightTabId;
  delete persisted.activePane;
  delete persisted.splitRatio;

  const allGroupLayout = normalizeAllGroupLayout(
    persisted.allGroupLayout,
    groups,
  );

  return {
    ...currentState,
    ...persisted,
    groups,
    activeGroupId,
    allGroupLayout,
    nextTabNumber,
    closedTabs: normalizeClosedTabs(persisted.closedTabs),
    settings,
  };

  function createLegacyGroupTab(): NoteTab {
    while (reservedTabIds.has(`tab-${nextTabNumber}`)) nextTabNumber += 1;
    const tab = createNoteTab(nextTabNumber, settings.tabColorCycle[0]);
    reservedTabIds.add(tab.id);
    nextTabNumber += 1;
    return tab;
  }
}
