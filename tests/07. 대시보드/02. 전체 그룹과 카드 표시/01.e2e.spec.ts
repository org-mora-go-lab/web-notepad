import { expect, test } from "@playwright/test";

import { openPanel, switchGroup } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../../__util__";

test("1. All Group 대시보드는 모든 그룹 탭과 소속 그룹 이름을 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await switchGroup(page, "All Group");
  await openPanel(page, "dashboard-panel");

  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(4);
  await expect(dashboardPanel(page).locator(".dashboard-card").filter({ hasText: "Work only task" }).locator(".dashboard-card-group")).toHaveText("Work");
});
