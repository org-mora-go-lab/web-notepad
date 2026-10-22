import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";

test("9. 로그인 영역은 PC 좌우 5px, 모바일 좌우 1px 여백을 사용한다", async ({ page }) => {
  await page.goto("/");
  const login = page.locator(".auth-command");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(login).toHaveCSS("padding-left", "5px");
  await expect(login).toHaveCSS("padding-right", "5px");

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(login).toHaveCSS("padding-left", "1px");
  await expect(login).toHaveCSS("padding-right", "1px");
});
