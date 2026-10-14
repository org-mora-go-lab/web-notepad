import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { bookmarksCommand } from "../../__util__";

test("1. 모바일 하단 패널 명령 아이콘은 28.8px, 현재 그룹 이름은 17px로 표시한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  await expect(bookmarksCommand(page).locator(".status-label")).toBeVisible();
  await expect(bookmarksCommand(page).locator("svg")).toHaveCSS("width", /^28\.(8|79)/);
  await expect(page.locator(".group-select-name")).toHaveCSS("font-size", "17px");
});
