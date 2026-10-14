import { expect, test } from "@playwright/test";

import { openPanel, readStoredState } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../__util__";

test("4. 열린 카드를 원래 컬럼에 다시 드롭해도 카드·탭을 중복 생성하지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const before = await readStoredState(page);
  await source.dragTo(dashboardColumn(page, "todo"));
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(1);
  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(3);
  await expect(source).toHaveAttribute("data-tab-color", "gray");
  await expect(page.locator(".tab-item", { hasText: "Alpha task" })).toHaveCount(1);
  const after = await readStoredState(page);
  expect(after.groups).toEqual(before.groups);
  expect(after.closedTabs).toEqual(before.closedTabs);
  await expect(dashboardPanel(page).locator(".is-drop-target, .is-dragging")).toHaveCount(0);
});
