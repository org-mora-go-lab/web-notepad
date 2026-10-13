import { expect, test } from "@playwright/test";

import { addTabButton, openPanel } from "../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("2. 현재 그룹의 탭을 탭 색상(Gray·Green·Purple)에 따라 Todo·In Progress·Done 컬럼에 개수와 함께 표시하고 새 탭은 Todo에 둔다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await expect(dashboardPanel(page).locator(".dashboard-column h3")).toHaveText(["Todo1", "In Progress1", "Done1"]);
  await expect(dashboardColumn(page, "todo")).toContainText("Alpha task");
  await expect(dashboardColumn(page, "todo")).toContainText("alpha body");
  await expect(dashboardColumn(page, "in-progress")).toContainText("Beta task");
  await expect(dashboardColumn(page, "done")).toContainText("Gamma task");

  await page.keyboard.press("Escape");
  await addTabButton(page).click();
  await openPanel(page, "dashboard-panel");
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(2);
});
