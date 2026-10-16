import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { dashboardPanel, openPanel, seedDashboardTabs } from "../../__util__";

test("2. 메뉴 버튼 재선택과 영역 바깥 클릭으로 상태 선택 영역을 닫는다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedDashboardTabs(page);
    await openPanel(page, "dashboard-panel");
    const panel = dashboardPanel(page);
    const trigger = panel.locator(".dashboard-options-trigger");
    const menu = panel.locator(".dashboard-options-menu");
    await trigger.click();
    await expect(menu).toBeVisible();
    await trigger.click();
    await expect(menu).toHaveCount(0);
    await trigger.click();
    await panel.locator("h2").click();
    await expect(menu).toHaveCount(0);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toHaveAttribute("aria-hidden", "false");
  }
});
