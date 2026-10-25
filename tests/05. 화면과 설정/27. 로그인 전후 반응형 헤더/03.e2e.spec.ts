import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("3. 모바일 로그아웃 후 로그인 영역의 위치와 크기가 유지된다", async ({ page, context }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await expect(page.locator("a.auth-command")).toBeVisible();
  const before = (await page.locator(".header-auth").boundingBox())!;
  await authenticateBrowser(context, signedSession({
    id: "layout-logout",
    nickname: "로그인 사용자",
    expiresAt: Date.now() + 60_000,
  }));
  await page.reload();
  const logout = page.locator("button.auth-command");
  await expect(logout).toBeVisible();
  await logout.click();
  await expect(page.locator("a.auth-command")).toBeVisible();
  expect(await page.locator(".header-auth").boundingBox()).toEqual(before);
});
