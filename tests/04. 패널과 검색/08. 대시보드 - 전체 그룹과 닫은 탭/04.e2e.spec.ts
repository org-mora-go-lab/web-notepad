import { expect, test } from "@playwright/test";

import {
  createClosedTabFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import { groupsCommand, openPanel, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("4. All의 Done 컬럼은 모든 그룹의 열린 Done 탭과 닫은 탭을 개수에 포함한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("u-open", "Ungrouped open closed", { tabColor: "purple" }),
      ]),
      createGroupFixture("work", "Work", [
        createTabFixture("w-open", "Work open closed", { tabColor: "purple" }),
      ]),
    ],
    closedTabs: [
      createClosedTabFixture(
        "u-archive",
        "ungrouped",
        createTabFixture("u-closed", "Ungrouped archived", { tabColor: "purple" }),
      ),
      createClosedTabFixture(
        "w-archive",
        "work",
        createTabFixture("w-closed", "Work archived", { tabColor: "purple" }),
      ),
    ],
    nextTabNumber: 5,
  });
  await groupsCommand(page).click();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await groupsCommand(page).click();
  await openPanel(page, "dashboard-panel");

  const closed = dashboardColumn(page, "done");
  await expect(closed.locator(".dashboard-card")).toHaveCount(4);
  for (const text of [
    "Ungrouped open closed",
    "Work open closed",
    "Ungrouped archived",
    "Work archived",
  ]) {
    await expect(closed.locator(".dashboard-card", { hasText: text })).toHaveCount(1);
  }
  await expect(page.locator('.dashboard-statuses [data-status="done"] .dashboard-count')).toHaveText("4");
});
