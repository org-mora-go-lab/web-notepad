import type { GroupEntry, SharedGroupData } from "../type";
import { normalizeLayout } from "./pane";

export const sharedGroupId = (shareId: string) => `shared-${shareId}`;
export const isSharedGroupId = (id: string) =>
  /^shared-[0-9a-f-]{36}$/i.test(id);

export function namespaceGroup(group: GroupEntry, shareId: string): GroupEntry {
  const id = sharedGroupId(shareId);
  const tabId = (value: string) => `${id}-${value}`;
  const bookmarkId = (value: string) => `${id}-${value}`;
  return {
    ...group,
    id,
    tabs: group.tabs.map((tab) => ({ ...tab, id: tabId(tab.id) })),
    bookmarks: group.bookmarks.map((bookmark) => ({
      ...bookmark,
      id: bookmarkId(bookmark.id),
      sourceTabId: tabId(bookmark.sourceTabId),
    })),
    activeTabId: tabId(group.activeTabId),
    rightTabIds: group.rightTabIds.map(tabId),
    activeRightTabId: group.activeRightTabId
      ? tabId(group.activeRightTabId)
      : null,
    leftBottomTabIds: group.leftBottomTabIds.map(tabId),
    activeLeftBottomTabId: group.activeLeftBottomTabId
      ? tabId(group.activeLeftBottomTabId)
      : null,
    rightBottomTabIds: group.rightBottomTabIds.map(tabId),
    activeRightBottomTabId: group.activeRightBottomTabId
      ? tabId(group.activeRightBottomTabId)
      : null,
  };
}

export function toSharedGroupData(group: GroupEntry): SharedGroupData {
  return {
    id: group.id,
    name: group.name,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    tabs: group.tabs,
    bookmarks: group.bookmarks,
    dashboardStatusNames: group.dashboardStatusNames,
  };
}

export function applySharedGroupData(
  group: GroupEntry,
  data: SharedGroupData,
): GroupEntry {
  const openIds = new Set(
    data.tabs.filter((tab) => tab.open).map((tab) => tab.id),
  );
  const activeTabId = openIds.has(group.activeTabId)
    ? group.activeTabId
    : (data.tabs.find((tab) => tab.open)?.id ?? "");
  return normalizeLayout({
    ...group,
    ...data,
    pinned: group.pinned,
    sortOrder: group.sortOrder,
    dashboardVisibility: group.dashboardVisibility,
    activeTabId,
    rightTabIds: group.rightTabIds.filter((id) => openIds.has(id)),
    leftBottomTabIds: group.leftBottomTabIds.filter((id) => openIds.has(id)),
    rightBottomTabIds: group.rightBottomTabIds.filter((id) => openIds.has(id)),
  });
}

export function createJoinedGroup(data: SharedGroupData): GroupEntry {
  const firstOpenTab = data.tabs.find((tab) => tab.open);
  return normalizeLayout({
    ...data,
    pinned: false,
    activeTabId: firstOpenTab?.id ?? "",
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
  });
}
