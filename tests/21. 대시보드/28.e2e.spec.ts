import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { dashboardPanel, seedDashboardTabs } from "./__util__";

test("28. 현재 탭을 강조하고 고정 패널에서 카드 선택 시 강조를 옮긴다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const panel = dashboardPanel(page);
  await expect(panel.locator(".is-active .dashboard-card-open")).toContainText("Alpha task");
  await expect(panel.locator('[aria-current="true"]')).toHaveCount(1);
  await expect(panel.locator(".dashboard-card.is-active")).toHaveCSS("border-top-width", "1px");
  await expect(panel.locator(".dashboard-card.is-active")).toHaveCSS("box-shadow", "none");
  const borderColor = await panel.locator(".dashboard-card.is-active").evaluate((card) => getComputedStyle(card).borderTopColor);
  expect(borderColor).toMatch(/(?:\/\s*0\.5\s*\)|,\s*0\.5\s*\))/);
  await panel.getByRole("button", { name: "패널 고정", exact: true }).click();
  await panel.getByRole("button", { name: "Beta task", exact: true }).click();
  await expect(panel.locator(".is-active .dashboard-card-open")).toContainText("Beta task");
  await expect(page.locator("textarea")).toHaveValue("Beta task");
});
