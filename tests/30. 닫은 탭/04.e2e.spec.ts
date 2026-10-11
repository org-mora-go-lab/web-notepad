import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../__fixture__";
import { groupStatusName, openClosedPanel, restoreFirstClosedTab, writeStoredState } from "../__util__";

test("4. 닫을 당시의 그룹이 삭제되었으면 Ungrouped로 표시하고 Ungrouped로 복원한다", async ({ page }) => {
  await writeStoredState(page, {
    groups: [createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "")])],
    activeGroupId: "ungrouped",
    nextTabNumber: 3,
    closedTabs: [
      createClosedTabFixture("closed-1", "group-deleted", createTabFixture("tab-2", "orphan note")),
    ],
  });

  await openClosedPanel(page);
  await expect(page.locator(".closed-item-heading strong")).toHaveText("Ungrouped");
  await restoreFirstClosedTab(page);

  await expect(groupStatusName(page)).toHaveText("Ungrouped");
  await expect(page.locator("textarea")).toHaveValue("orphan note");
});
