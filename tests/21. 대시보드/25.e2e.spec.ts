import { expect, test } from "@playwright/test";

import { openPanel, readStoredState } from "../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("25. 닫은 카드를 Closed에 다시 드롭하면 복원하거나 중복 보관하지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const target = dashboardColumn(page, "done");
  await source.dragTo(target);
  const before = await readStoredState(page);
  await expect.poll(async () => (await readStoredState(page)).closedTabs?.length).toBe(1);
  await target.locator(".dashboard-card", { hasText: "Alpha task" }).dragTo(target);
  await expect(page.locator(".tab-item", { hasText: "Alpha task" })).toHaveCount(0);
  await expect(target.locator(".dashboard-card", { hasText: "Alpha task" })).toHaveCount(1);
  expect(await readStoredState(page)).toEqual(before);
  await expect(dashboardPanel(page).locator(".is-drop-target, .is-dragging")).toHaveCount(0);
});
