import { expect, test } from "@playwright/test";

import { groupsCommand, openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../__util__";

test("1. All 대시보드는 모든 그룹의 열린 탭을 모으고 카드에 소속 그룹 이름을 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await groupsCommand(page).click();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await groupsCommand(page).click();
  await openPanel(page, "dashboard-panel");

  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(4);
  await expect(dashboardPanel(page).locator(".dashboard-card").filter({ hasText: "Work only task" }).locator(".dashboard-card-group")).toHaveText("Work");
});
