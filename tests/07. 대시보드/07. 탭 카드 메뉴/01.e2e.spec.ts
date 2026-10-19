import { expect, test } from "@playwright/test";

import { dashboardColumn, openPanel, seedDashboardTabs, toggleDashboardStatus } from "../../__util__";

test("1. To Do 카드 메뉴 맨 아래의 Note를 선택하면 Note 상태로 이동한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo").locator(".dashboard-card", { hasText: "Alpha task" }).click({ button: "right" });
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem").last()).toHaveText("Note");
  await expect(menu.getByRole("menuitem", { name: "Closed", exact: true })).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "Pin", exact: true })).toHaveCount(0);
  await menu.getByRole("menuitem", { name: "Note", exact: true }).click();
  await expect(menu).toHaveCount(0);
  await toggleDashboardStatus(page, "icebox");
  await expect(dashboardColumn(page, "icebox").locator(".dashboard-card", { hasText: "Alpha task" })).toBeVisible();
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card", { hasText: "Alpha task" })).toHaveCount(0);
});
