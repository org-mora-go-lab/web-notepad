import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("8. 모바일 탭은 최대 너비 247.65px, 높이 45px, 하단 추가 여백 1px이며 탭 조작 버튼과 헤더 높이를 맞춘다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const tab = page.locator(".tab-item").first();

  await expect(tab).toHaveCSS("height", "45px");
  await expect(tab).toHaveCSS("padding-bottom", "1px");
  await expect(page.locator(".header")).toHaveCSS("height", "45px");
  await expect(page.locator(".add-tab")).toHaveCSS("height", "45px");
  await expect.poll(() => page.locator(".note-pane").evaluate(
    (element) => getComputedStyle(element).gridTemplateRows.split(" ")[0],
  )).toBe("45px");
  await expect(tab).toHaveCSS("min-width", "114.406px");
  await expect(tab).toHaveCSS("max-width", "247.65px");
  await expect(tab.getByRole("tab")).toHaveCSS("height", "44px");
  await expect(tab.locator(".tab-close")).toHaveCSS("height", "44px");
});
