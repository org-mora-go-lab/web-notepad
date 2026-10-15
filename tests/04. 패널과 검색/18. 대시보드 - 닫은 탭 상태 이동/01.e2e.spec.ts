import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../__util__";

test("1. Done 카드를 Todo로 옮기면 Todo 색상으로 정확히 한 번 복원한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo")
    .locator(".dashboard-card", { hasText: "Alpha task" })
    .dragTo(dashboardColumn(page, "done"));

  await dashboardColumn(page, "done")
    .locator(".dashboard-card", { hasText: "Alpha task" })
    .dragTo(dashboardColumn(page, "todo"));

  const restored = dashboardPanel(page).locator(".dashboard-card", { hasText: "Alpha task" });
  await expect(restored).toHaveCount(1);
  await expect(restored).toHaveAttribute("data-tab-color", "gray");
  await expect(page.locator(".tab-item", { hasText: "Alpha task" })).toHaveCount(1);
});
