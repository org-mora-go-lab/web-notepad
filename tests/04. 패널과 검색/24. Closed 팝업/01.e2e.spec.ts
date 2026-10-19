import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("1. Icebox와 Closed 명령으로 각 대시보드 상태를 표시하고 숨긴다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openPanel(page, "dashboard-panel");
  await page.locator(".dashboard-options-trigger").click();
  const iceboxCommand = page.locator(".dashboard-icebox-command");
  const closedCommand = page.locator(".dashboard-closed-command");
  await expect(closedCommand.locator("svg")).toHaveClass(/lucide-ghost/);
  await expect(iceboxCommand).toHaveAttribute("aria-pressed", "true");
  await expect(closedCommand).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".dashboard-icebox-column")).toBeVisible();
  await closedCommand.click();
  await expect(closedCommand).toHaveAttribute("aria-pressed", "true");
  await expect(closedCommand.locator(".lucide-ghost")).toHaveCSS("fill", "none");
  await expect(page.locator(".dashboard-closed-column .dashboard-card")).toContainText("Archived note");
  await expect(page.locator("#closed-popup")).toHaveCount(0);
  await iceboxCommand.click();
  await expect(page.locator(".dashboard-icebox-column")).toHaveCount(0);
  await closedCommand.click();
  await expect(page.locator(".dashboard-closed-column")).toHaveCount(0);
});
