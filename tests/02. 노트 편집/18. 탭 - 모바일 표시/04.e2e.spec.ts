import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test("4. 모바일 헤더·새 탭 버튼·패널 탭 행은 45px 높이로 맞춘다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  await expect(page.locator(".header")).toHaveCSS("height", "45px");
  await expect(page.locator(".add-tab")).toHaveCSS("height", "45px");
  await expect.poll(() => page.locator(".note-pane").evaluate(
    (element) => getComputedStyle(element).gridTemplateRows.split(" ")[0],
  )).toBe("45px");
});
