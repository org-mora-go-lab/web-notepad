import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("1. 모바일 탭 카드 드래그는 편집기를 열거나 포커스하지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");

  const card = dashboardPanel(page).locator(".dashboard-card").first();
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await card.dispatchEvent("dragstart", { dataTransfer });
  await card.dispatchEvent("dragend", { dataTransfer });
  await card.locator(".dashboard-card-open").click();
  await page.waitForTimeout(300);

  await expect(dashboardPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("textarea:focus")).toHaveCount(0);
});
