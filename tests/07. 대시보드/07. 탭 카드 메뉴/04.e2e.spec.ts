import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardColumn, openPanel, toggleDashboardStatus, writeStoredState } from "../../__util__";

test("4. Done 카드 메뉴 맨 아래의 Closed를 선택하면 Closed 상태로 이동한다", async ({ page }) => {
  await writeStoredState(page, {
    groups: [createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "Done task", { tabColor: "purple" })])],
  });
  await openPanel(page, "dashboard-panel");
  await toggleDashboardStatus(page, "closed");
  await dashboardColumn(page, "done").locator(".dashboard-card", { hasText: "Done task" }).click({ button: "right" });
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem").last()).toHaveText("Closed");
  await expect(menu.getByRole("menuitem", { name: "Note", exact: true })).toHaveCount(0);
  await menu.getByRole("menuitem", { name: "Closed", exact: true }).click();
  await expect(menu).toHaveCount(0);
  await expect(dashboardColumn(page, "closed").locator(".dashboard-card", { hasText: "Done task" })).toBeVisible();
  await expect(dashboardColumn(page, "done").locator(".dashboard-card", { hasText: "Done task" })).toHaveCount(0);
});
