import { expect, test } from "@playwright/test";

import { openPanel, switchGroup } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../__util__";

test("4. 대시보드는 그룹별로 독립되어 현재 그룹의 탭만 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await expect(dashboardPanel(page).locator(".dashboard-group")).toHaveCount(0);
  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(3);

  await page.keyboard.press("Escape");
  await switchGroup(page, "Work");
  await openPanel(page, "dashboard-panel");
  await expect(dashboardPanel(page).locator(".dashboard-group")).toHaveCount(0);
  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(1);
  await expect(dashboardColumn(page, "todo")).toContainText("Work only task");
});
