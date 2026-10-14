import { ALL_GROUP_ID } from "../constant";
import type { GroupEntry, PaneLayout } from "../type";
import { getPaneLayout, normalizeLayout, PANE_IDS } from "../util";

export function normalizeAllGroupLayout(
  layout: PaneLayout | null | undefined,
  groups: GroupEntry[],
): PaneLayout | null {
  const readLayoutIds = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.filter((id): id is string => typeof id === "string")
      : [];
  const readLayoutActive = (value: unknown) =>
    typeof value === "string" ? value : null;
  return layout && typeof layout === "object"
    ? getPaneLayout(
        normalizeLayout({
          id: ALL_GROUP_ID,
          name: "All Group",
          pinned: false,
          createdAt: 0,
          tabs: groups.flatMap((group) => group.tabs),
          bookmarks: [],
          activeTabId: readLayoutActive(layout.activeTabId) ?? "",
          rightTabIds: readLayoutIds(layout.rightTabIds),
          activeRightTabId: readLayoutActive(layout.activeRightTabId),
          leftBottomTabIds: readLayoutIds(layout.leftBottomTabIds),
          activeLeftBottomTabId: readLayoutActive(layout.activeLeftBottomTabId),
          rightBottomTabIds: readLayoutIds(layout.rightBottomTabIds),
          activeRightBottomTabId: readLayoutActive(
            layout.activeRightBottomTabId,
          ),
          activePane: PANE_IDS.includes(layout.activePane)
            ? layout.activePane
            : "left",
          splitRatio: 0.5,
          leftRowRatio: 0.5,
          rightRowRatio: 0.5,
        }),
      )
    : null;
}
