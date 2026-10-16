import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { dashboardPanel, openPanel, seedDashboardTabs } from "../../__util__";

test("1. PC와 모바일에서 우측 세로 점 메뉴로 상태를 전환하고 선택 영역을 유지한다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedDashboardTabs(page);
    await openPanel(page, "dashboard-panel");
    const panel = dashboardPanel(page);
    const trigger = panel.locator(".dashboard-options-trigger");
    await expect(panel.locator(".dashboard-footer")).toHaveCount(0);
    await expect(panel.locator(".side-panel-header").locator(".dashboard-options-trigger")).toBeVisible();
    await trigger.click();
    const menu = panel.getByRole("dialog", { name: "Dashboard options" });
    await expect(menu.locator(".dashboard-icebox-command > svg")).toHaveClass(/lucide-sticky-note/);
    const menuBox = (await menu.boundingBox())!;
    expect(menuBox.x).toBeGreaterThanOrEqual(0);
    expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(viewport.width);
    for (const status of ["icebox", "closed"] as const) {
      const command = menu.locator(`.dashboard-${status}-command`);
      await expect(command).toHaveAttribute("aria-pressed", "false");
      await command.click();
      await expect(menu).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(command).toHaveAttribute("aria-pressed", "true");
      await expect(command.locator(".dashboard-option-check")).toBeVisible();
      await expect(panel.locator(`.dashboard-${status}-column`)).toBeVisible();
      await command.click();
      await expect(menu).toBeVisible();
      await expect(command).toHaveAttribute("aria-pressed", "false");
      await expect(panel.locator(`.dashboard-${status}-column`)).toHaveCount(0);
    }
  }
});
