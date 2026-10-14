import { expect, test } from "@playwright/test";

import { groupsCommand, openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../__util__";

test("3. 대시보드는 현재 그룹의 탭만 표시하고 그룹 이름 필드를 표시하지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await expect(dashboardPanel(page).locator(".dashboard-group")).toHaveCount(0);
  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(3);
  await page.keyboard.press("Escape");

  await groupsCommand(page).click();
  await page.getByRole("button", { name: "Work", exact: true }).click();
  await groupsCommand(page).click();
  await openPanel(page, "dashboard-panel");
  await expect(dashboardPanel(page).locator(".dashboard-group")).toHaveCount(0);
  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(1);
  await expect(dashboardColumn(page, "todo")).toContainText("Work only task");
});
