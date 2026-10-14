import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../../__fixture__";
import { writeStoredState } from "../../../__util__";
import { dragTabToZone, paneSlot, seedAllGroupState } from "../../__util__";

export async function seedTwoGroupAllView(page: Page) {
  await writeStoredState(page, {
    activeGroupId: "all-group",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("first", "first")]),
      createGroupFixture("work", "Work", [createTabFixture("second", "second")]),
    ],
  });
}

export async function createAllGroupQuad(page: Page) {
  await seedAllGroupState(page);
  const tab = (title: string) => page.getByRole("tab", { name: title, exact: true }).locator("..");
  await dragTabToZone(page, tab("d"), paneSlot(page, "left"), "Split down");
  await dragTabToZone(page, tab("c"), paneSlot(page, "left"), "Split right");
  await dragTabToZone(page, tab("b"), paneSlot(page, "right"), "Split down");
  return tab;
}
