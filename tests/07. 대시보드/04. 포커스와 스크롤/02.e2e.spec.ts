import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../../__util__";

test("2. 고정 대시보드에서 다른 카드를 선택하면 현재 카드 강조를 함께 옮긴다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const panel = dashboardPanel(page);
  await panel.getByRole("button", { name: "Pin panel", exact: true }).click();
  await panel.getByRole("button", { name: "Beta task", exact: true }).click();

  await expect(panel.locator(".dashboard-card.is-active .dashboard-card-open")).toContainText("Beta task");
  await expect(page.locator("textarea")).toHaveValue("Beta task");
});
