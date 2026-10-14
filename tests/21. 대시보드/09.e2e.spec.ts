import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("9. 대시보드 내부 글자를 1.2배로 표시하고 개수의 오른쪽 padding을 10px로 둔다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const panel = dashboardPanel(page);
  const card = dashboardColumn(page, "todo").locator(".dashboard-card");

  await expect(panel.locator(".dashboard-statuses h3").first()).toHaveCSS("font-size", "16.8px");
  await expect(card.locator("strong")).toHaveCSS("font-size", "16.8px");
  await expect(card.locator(".dashboard-card-preview")).toHaveCSS("font-size", "15.6px");
  await expect(panel.locator(".dashboard-count").first()).toHaveCSS("font-size", "14.4px");
  await expect(panel.locator(".dashboard-count").first()).toHaveCSS("padding-right", "10px");
  await expect(panel.locator(".dashboard-statuses h3").first()).toHaveCSS("padding-top", "5px");
  await expect(panel.locator(".dashboard-statuses h3").first()).toHaveCSS("padding-bottom", "5px");
});
