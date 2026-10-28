import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";

test("9. 하단 로그인 영역은 좌우 padding 없이 PC 116px, 모바일은 메뉴 한 칸의 너비를 사용한다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".auth-command:not(.is-loading)")).toBeVisible();
  const login = page.locator(".auth-command");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(login).toHaveCSS("padding-left", "0px");
  await expect(login).toHaveCSS("padding-right", "0px");
  await expect(login).toHaveCSS("width", "116px");

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(login).toHaveCSS("padding-left", "0px");
  await expect(login).toHaveCSS("padding-right", "0px");
  await expect
    .poll(async () =>
      Math.abs(
        (await login.boundingBox())!.width -
          (await page.locator(".footer-auth").boundingBox())!.width,
      ),
    )
    .toBeLessThan(1);
});
