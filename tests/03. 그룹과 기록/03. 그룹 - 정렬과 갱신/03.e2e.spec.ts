import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { createGroup, groupsCommand } from "../../__util__";

test("3. 하단 그룹 버튼은 PC에서 그룹명만, 모바일에서는 아이콘과 GROUP을 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const name = "Very long group name for desktop and mobile line clamp check";
  await createGroup(page, name);
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    await expect(groupsCommand(page).locator("svg.lucide-layers")).toHaveCount(1);
    await expect(groupsCommand(page)).toHaveAttribute("aria-label", "Toggle groups");
    await expect(groupsCommand(page).locator(".group-current-value")).toHaveText(name);
  }

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(page.locator(".current-group-panel")).toBeHidden();
  await expect(groupsCommand(page).locator(".group-current-value")).toHaveText(name);
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(page.locator(".current-group-name")).toHaveText(name);
  await expect(groupsCommand(page).locator(".group-current-value")).toBeHidden();
});
