import { expect, test } from "@playwright/test";

import {
  createClosedTabFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import {
  openClosedPanel,
  readStoredState,
  restoreFirstClosedTab,
  writeStoredState,
} from "../../__util__";

test("7. 열린 탭과 ID가 충돌하는 닫은 탭은 새 ID로 복원해 두 탭을 유지한다", async ({
  page,
}) => {
  const openTab = createTabFixture("tab-1", "open note");
  await writeStoredState(page, {
    groups: [createGroupFixture("ungrouped", "Ungrouped", [openTab])],
    activeGroupId: "ungrouped",
    nextTabNumber: 2,
    closedTabs: [
      createClosedTabFixture(
        "closed-collision",
        "ungrouped",
        createTabFixture("tab-1", "archived note"),
      ),
    ],
  });

  await openClosedPanel(page);
  await restoreFirstClosedTab(page);
  await expect(page.locator("textarea")).toHaveValue("archived note");
  await expect(page.locator(".tab-item")).toHaveCount(2);

  let stored = await readStoredState(page);
  expect(stored.groups[0].tabs.map((tab) => tab.content).sort()).toEqual([
    "archived note",
    "open note",
  ]);
  expect(new Set(stored.groups[0].tabs.map((tab) => tab.id)).size).toBe(2);
  expect(stored.closedTabs).toHaveLength(0);

  await page.reload();
  await expect(page.locator(".tab-item")).toHaveCount(2);
  stored = await readStoredState(page);
  expect(new Set(stored.groups[0].tabs.map((tab) => tab.id)).size).toBe(2);
});
