import { expect, test } from "@playwright/test";

import { cycleActiveTabColor, openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("9. 탭에서 색상을 변경하면 대시보드의 컬럼도 함께 바뀐다", async ({ page }) => {
  await seedDashboardTabs(page);
  // tab-1 is gray (Todo): gray -> green -> purple.
  await cycleActiveTabColor(page, 1);
  await openPanel(page, "dashboard-panel");
  await expect(dashboardColumn(page, "in-progress")).toContainText("Alpha task");

  await page.keyboard.press("Escape");
  await cycleActiveTabColor(page, 1);
  await openPanel(page, "dashboard-panel");
  await expect(dashboardColumn(page, "done")).toContainText("Alpha task");
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(0);
});
