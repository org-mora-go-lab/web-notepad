import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("2. 그룹 개수 배지 없이 PC는 현재 그룹명을, 모바일은 GROUP 라벨을 표시한다", async ({ page }) => {
  await page.goto("/");
  const groupCommand = page.locator(".group-status-command");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(groupCommand.locator("svg")).toHaveCount(1);
    await expect(groupCommand.locator(".status-count")).toHaveCount(0);
    if (viewport.width <= 640) {
      await expect(groupCommand.locator(".group-status-name")).toBeHidden();
      await expect(groupCommand.locator(".group-status-label")).toHaveText("GROUP");
      await expect(groupCommand.locator(".group-status-label")).toBeInViewport();
      await expect(page.locator(".current-group-name")).toHaveText("Ungrouped");
      await expect(page.locator(".current-group-panel")).toBeVisible();
    } else {
      await expect(groupCommand.locator(".group-status-name")).toHaveText("Ungrouped");
      await expect(groupCommand.locator(".group-status-name")).toBeVisible();
      await expect(groupCommand.locator(".group-status-label")).toBeHidden();
      await expect(page.locator(".current-group-panel")).toBeHidden();
    }
  }
});
