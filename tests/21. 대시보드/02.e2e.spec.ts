import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("2. 현재 그룹의 탭을 탭 색상(Gray·Green·Purple)에 따라 Todo·WIP·Closed 컬럼에 개수와 함께 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await expect(dashboardPanel(page).locator(".dashboard-statuses h3")).toHaveText(["Todo1", "WIP1", "Closed1"]);
  await expect(dashboardPanel(page).locator(".dashboard-statuses h3").first()).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(dashboardColumn(page, "todo")).toContainText("Alpha task");
  await expect(dashboardColumn(page, "todo")).toContainText("alpha body");
  await expect(dashboardColumn(page, "in-progress")).toContainText("Beta task");
  await expect(dashboardColumn(page, "done")).toContainText("Gamma task");

});
