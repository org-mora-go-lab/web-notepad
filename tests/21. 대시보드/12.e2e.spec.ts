import { expect, test } from "@playwright/test";

import { openPanel, readStoredState } from "../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("12. Closed 컬럼으로 옮긴 탭은 팝업 없이 에디터에서 사라져 닫은 탭에 보관되고 Closed 컬럼에 카드로 남는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");

  await dashboardColumn(page, "todo").locator(".dashboard-card", { hasText: "Alpha task" })
    .dragTo(dashboardColumn(page, "done"));

  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator(".tab-item", { hasText: "Alpha task" })).toHaveCount(0);
  await expect(dashboardColumn(page, "done").locator(".dashboard-card")).toHaveCount(2);
  await expect(dashboardColumn(page, "done")).toContainText("Alpha task");
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(0);
  await expect.poll(async () => (await readStoredState(page)).closedTabs?.length).toBe(1);

  await dashboardColumn(page, "done").locator(".dashboard-card", { hasText: "Alpha task" })
    .dragTo(dashboardColumn(page, "in-progress"));
  await expect(dashboardColumn(page, "in-progress")).toContainText("Alpha task");
  await expect(page.locator(".tab-item", { hasText: "Alpha task" })).toHaveCount(1);
  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(3);
});
