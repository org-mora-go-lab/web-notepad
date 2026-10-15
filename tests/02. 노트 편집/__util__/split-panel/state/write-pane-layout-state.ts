import type { Page } from "@playwright/test";

import type { PaneLayout } from "@/src/4-entity/notepad";

import { createGroupFixture, createTabFixture } from "../../../../__fixture__";
import { writeStoredState } from "../../../../__util__";

// Seed the same view in a real group or in All without duplicating persisted layouts in tests.
export async function writePaneLayoutState(
  page: Page,
  tabIds: string[],
  layout: Partial<PaneLayout>,
  allGroup = false,
) {
  const tabs = tabIds.map((id) => createTabFixture(id, id));
  const group = createGroupFixture("ungrouped", "Ungrouped", tabs);
  const view: PaneLayout = {
    activeTabId: group.activeTabId,
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
    ...layout,
  };
  await writeStoredState(page, {
    activeGroupId: allGroup ? "all-group" : "ungrouped",
    groups: [allGroup ? group : { ...group, ...view }],
    ...(allGroup ? { allGroupLayout: view } : {}),
  });
}
