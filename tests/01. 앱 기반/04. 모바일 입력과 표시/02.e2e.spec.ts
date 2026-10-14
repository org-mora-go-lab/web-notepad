import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test("2. 모바일 하단 버튼 영역의 기본 높이는 76.8px이다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  await expect(page.locator(".footer")).toHaveCSS("min-height", "76.8px");
});
