import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("2. PC와 모바일 그룹 버튼은 개수 배지 없이 현재 그룹명을 표시한다", async ({ page }) => {
  await page.goto("/");
  const groupCommand = page.locator(".group-status-command");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(groupCommand.locator("svg")).toHaveCount(1);
    await expect(groupCommand.locator(".status-count")).toHaveCount(0);
    await expect(groupCommand.locator(".group-status-name")).toHaveText("Ungrouped");
    await expect(groupCommand.locator(".group-status-name")).toBeVisible();
    await expect(groupCommand).toHaveAttribute("aria-label", "그룹 선택: Ungrouped");
    await expect(page.locator(".current-group-panel")).toHaveCount(0);
    if (viewport.width <= 640) {
      await expect(groupCommand).toHaveCSS("flex-direction", "column");
    } else {
      await expect(groupCommand).toHaveCSS("flex-direction", "row");
    }
  }
});
