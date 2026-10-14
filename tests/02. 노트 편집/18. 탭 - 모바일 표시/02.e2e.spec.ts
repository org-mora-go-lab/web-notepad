import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test("2. 모바일 탭은 최소 137.287px·최대 247.65px 너비와 45px 높이 및 1px 하단 여백을 사용한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const tab = page.locator(".tab-item").first();

  await expect(tab).toHaveCSS("height", "45px");
  await expect(tab).toHaveCSS("padding-bottom", "1px");
  await expect(tab).toHaveCSS("min-width", "137.287px");
  await expect(tab).toHaveCSS("max-width", "247.65px");
});
