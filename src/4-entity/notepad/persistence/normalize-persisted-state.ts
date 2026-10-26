import { ALL_GROUP_ID, UNGROUPED_GROUP_ID } from "../constant";
import type { NotepadState, NoteTab } from "../type";
import { createNoteTab, normalizeDashboardVisibility } from "../util";
import { finiteNumberOr } from "./read-value";
import {
  normalizeBookmarks,
  normalizeClosedTabs,
  normalizeGroups,
  normalizeTabs,
} from "./record";
import { normalizeAllGroupLayout, normalizeSettings } from "./view";

export function normalizePersistedState(
  persistedState: unknown,
  currentState: NotepadState,
): NotepadState {
  const persisted = (
    persistedState && typeof persistedState === "object" ? persistedState : {}
  ) as Partial<NotepadState> & {
    tabs?: unknown;
    bookmarks?: unknown;
    activeTabId?: unknown;
    rightTabIds?: unknown;
    activeRightTabId?: unknown;
    activePane?: unknown;
    splitRatio?: unknown;
  };
  const settings = normalizeSettings(persisted.settings);
  const hasLegacyTabs = Array.isArray(persisted.tabs);
  const legacyTabs = normalizeTabs(persisted.tabs, currentState.groups[0].tabs);
  const legacyBookmarks = normalizeBookmarks(
    persisted.bookmarks,
    currentState.groups[0].bookmarks,
  );
  const sourceGroups = (
    Array.isArray(persisted.groups) ? persisted.groups : currentState.groups
  ).filter(
    (group) =>
      group && typeof group === "object" && typeof group.id === "string",
  );
  let nextTabNumber = finiteNumberOr(
    persisted.nextTabNumber,
    currentState.nextTabNumber,
  );
  const reservedTabIds = new Set([
    ...legacyTabs.map((tab) => tab.id),
    ...legacyBookmarks.map((bookmark) => bookmark.sourceTabId),
    // A recovered blank tab must not take the identity of a bookmark in any group.
    ...sourceGroups.flatMap((group) => [
      ...normalizeTabs(group.tabs, []).map((tab) => tab.id),
      ...normalizeBookmarks(group.bookmarks, []).map(
        (bookmark) => bookmark.sourceTabId,
      ),
    ]),
  ]);
  while (reservedTabIds.has(`tab-${nextTabNumber}`)) nextTabNumber += 1;

  const groups = normalizeGroups(
    sourceGroups,
    { fields: persisted, tabs: legacyTabs, bookmarks: legacyBookmarks },
    createLegacyGroupTab,
  );

  for (const group of groups) {
    group.tabs = group.tabs.map(tab => tab.dashboardStatus === "closed"
      ? { ...tab, dashboardStatus: "done", tabColor: settings.tabColorCycle[2] ?? "teal" } : tab);
  }
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
  const allGroupLayout = normalizeAllGroupLayout(
    persisted.allGroupLayout,
    groups,
  );

  return {
    ...currentState,
    groups,
    activeGroupId,
    allGroupActiveTabId:
      typeof persisted.allGroupActiveTabId === "string"
        ? persisted.allGroupActiveTabId
        : null,
    allGroupLayout,
    allGroupDashboardVisibility: normalizeDashboardVisibility(
      persisted.allGroupDashboardVisibility,
    ),
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
