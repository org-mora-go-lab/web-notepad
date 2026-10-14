import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { groupsCommand, groupStatusName } from "../../__util__";

test("3. PC와 모바일 모두 하단 그룹 선택 버튼에 아이콘과 개수 배지 없이 현재 그룹 이름을 표시한다", async ({ page }) => {
  await page.goto("/");
  const groupName = groupsCommand(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(groupName.locator("svg")).toHaveCount(1);
    await expect(groupName.locator(".status-count")).toHaveCount(0);
    await expect(groupStatusName(page)).toHaveText("Ungrouped");
    await expect(groupStatusName(page)).toBeVisible();
    await expect(page.locator(".group-status-command")).toHaveCount(0);
    await expect(groupName).toHaveAttribute("aria-label", "Select group: Ungrouped");
    await expect(page.locator(".current-group-panel")).toHaveCount(0);
  }
});
