import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { openPanel, writeStoredState } from "../__util__";
import { dashboardColumn, dashboardPanel } from "./__util__";

test("15. 내용이 비어 있는 탭은 대시보드에 표시하지 않고 개수에도 포함하지 않는다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [createGroupFixture("ungrouped", "Ungrouped", [
      createTabFixture("tab-1", "Filled task", { tabColor: "gray" }),
      createTabFixture("tab-2", "", { tabColor: "gray" }),
    ])],
    nextTabNumber: 3,
  });
  await openPanel(page, "dashboard-panel");

  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(1);
  await expect(dashboardColumn(page, "todo")).toContainText("Filled task");
  await expect(page.locator('.dashboard-statuses [data-status="todo"] .dashboard-count')).toHaveText("1");
  await expect(dashboardPanel(page)).not.toContainText("Empty Note");
});
