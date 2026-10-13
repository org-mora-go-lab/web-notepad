import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../__fixture__";
import { closeActiveTab, openPanel, seedStoredStateOnLoad } from "../__util__";
import { dashboardColumn } from "./__util__";

test("16. Closed 컬럼에서 연 탭을 수정 없이 X로 닫으면 짧은 내용이어도 Closed 컬럼에 다시 남는다", async ({ page }) => {
  const group = createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "Open task", { tabColor: "gray" })]);
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 3,
    closedTabs: [createClosedTabFixture("closed-1", group.id, createTabFixture("tab-2", "short", { tabColor: "purple" }))],
  });
  await openPanel(page, "dashboard-panel");

  await dashboardColumn(page, "done").locator(".dashboard-card", { hasText: "short" }).click();
  await expect(page.locator("textarea")).toHaveValue("short");
  await closeActiveTab(page);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);

  await openPanel(page, "dashboard-panel");
  await expect(dashboardColumn(page, "done").locator(".dashboard-card")).toHaveCount(1);
  await expect(dashboardColumn(page, "done")).toContainText("short");
});
