import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { createGroup, groupsCommand } from "../../__util__";

test("3. 하단 메뉴는 MENU를 표시하고 모바일은 별도 영역에 현재 그룹 이름을 유지한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const name = "Very long group name for desktop and mobile line clamp check";
  await createGroup(page, name);
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    await expect(groupsCommand(page).locator("svg.lucide-menu")).toHaveCount(1);
    await expect(groupsCommand(page)).toHaveAttribute("aria-label", "Toggle menu");
    await expect(groupsCommand(page).locator(".group-select-name:visible, .group-command-label:visible")).toHaveText("MENU");
  }

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(page.locator(".current-group-panel")).toBeHidden();
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(page.locator(".current-group-name")).toHaveText(name);
});
