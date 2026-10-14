import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../../__fixture__";
import { closeActiveTab, openClosedPanel, readStoredState, restoreFirstClosedTab, writeStoredState } from "../../__util__";

test("5. 복원 후 수정하지 않은 짧은 탭도 확인 없이 닫고 다시 보관한다", async ({ page }) => {
  const group = createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "")]);
  await writeStoredState(page, {
    groups: [group], activeGroupId: group.id, nextTabNumber: 3,
    closedTabs: [createClosedTabFixture("closed-short", group.id, createTabFixture("tab-2", "short"))],
  });
  await openClosedPanel(page);
  await restoreFirstClosedTab(page);
  await closeActiveTab(page);

  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  expect((await readStoredState(page)).closedTabs?.map((entry) => entry.tab.content)).toContain("short");
});
