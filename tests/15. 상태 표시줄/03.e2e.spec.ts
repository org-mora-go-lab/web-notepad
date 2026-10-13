import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS, MOBILE_VIEWPORT } from "../__constant__";
import { groupsCommand, groupStatusName } from "../__util__";

test("3. 모바일은 하단 왼쪽, PC는 우측 그룹 선택 버튼에 개수 배지 없이 현재 그룹 이름을 표시한다", async ({ page }) => {
  await page.goto("/");
  const groupName = groupsCommand(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const mobile = viewport === MOBILE_VIEWPORT;
    await expect(groupName.locator("svg")).toHaveCount(mobile ? 0 : 1);
    await expect(groupName.locator(".status-count")).toHaveCount(0);
    await expect(groupStatusName(page)).toHaveText("Ungrouped");
    await expect(groupStatusName(page)).toBeVisible();
    await expect(page.locator(".group-status-command")).toBeVisible({ visible: mobile });
    if (mobile) await expect(groupName).toHaveAttribute("aria-label", "그룹 선택: Ungrouped");
    await expect(page.locator(".current-group-panel")).toHaveCount(0);
  }
});
