import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { groupsCommand } from "../__util__";

test("3. 하단 왼쪽에 아이콘과 개수 배지 없이 현재 그룹 이름을 표시한다", async ({ page }) => {
  await page.goto("/");
  const groupName = groupsCommand(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(groupName.locator("svg")).toHaveCount(0);
    await expect(groupName.locator(".status-count")).toHaveCount(0);
    await expect(groupName.locator(".group-status-name")).toHaveText("Ungrouped");
    await expect(groupName.locator(".group-status-name")).toBeVisible();
    await expect(groupName).toHaveAttribute("aria-label", "그룹 선택: Ungrouped");
    await expect(page.locator(".current-group-panel")).toHaveCount(0);
  }
});
