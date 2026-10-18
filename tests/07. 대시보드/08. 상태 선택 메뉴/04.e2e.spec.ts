import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { dashboardPanel, openPanel, seedDashboardTabs, switchGroup } from "../../__util__";

test("4. 그룹별 Note·Closed 선택 상태를 새로고침 후에도 복원하고 선택 영역은 닫는다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedDashboardTabs(page);
    await openPanel(page, "dashboard-panel");
    const panel = dashboardPanel(page);
    const trigger = panel.locator(".dashboard-options-trigger");
    await trigger.click();
    await panel.locator(".dashboard-icebox-command").click();
    await panel.locator(".dashboard-closed-command").click();
    await panel.locator(".side-panel-close").click();
    await switchGroup(page, "Work");
    await openPanel(page, "dashboard-panel");
    await expect(panel.locator(".dashboard-icebox-column")).toHaveCount(0);
    await expect(panel.locator(".dashboard-closed-column")).toHaveCount(0);
    await trigger.click();
    await panel.locator(".dashboard-closed-command").click();
    await panel.locator(".side-panel-close").click();
    await switchGroup(page, "Ungrouped");
    await openPanel(page, "dashboard-panel");
    await expect(panel.locator(".dashboard-icebox-column")).toBeVisible();
    await expect(panel.locator(".dashboard-closed-column")).toBeVisible();
    await panel.locator(".side-panel-close").click();
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    await openPanel(page, "dashboard-panel");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel.locator(".dashboard-options-menu")).toHaveCount(0);
    await expect(panel.locator(".dashboard-icebox-column")).toBeVisible();
    await expect(panel.locator(".dashboard-closed-column")).toBeVisible();
    await panel.locator(".side-panel-close").click();
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    await page.reload();
    await openPanel(page, "dashboard-panel");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel.locator(".dashboard-icebox-column")).toBeVisible();
    await expect(panel.locator(".dashboard-closed-column")).toBeVisible();
    await panel.locator(".side-panel-close").click();
    await switchGroup(page, "Work");
    await openPanel(page, "dashboard-panel");
    await expect(panel.locator(".dashboard-icebox-column")).toHaveCount(0);
    await expect(panel.locator(".dashboard-closed-column")).toBeVisible();
  }
});
