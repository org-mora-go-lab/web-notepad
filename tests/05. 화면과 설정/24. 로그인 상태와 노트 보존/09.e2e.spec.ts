import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";

test("9. 하단 로그인 링크는 PC에서 콘텐츠 너비, 모바일에서 메뉴 한 칸의 너비를 사용한다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".auth-command:not(.is-loading)")).toBeVisible();
  const login = page.locator(".auth-command");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(login).toHaveCSS("padding-left", "0px");
  await expect(login).toHaveCSS("padding-right", "0px");
  const icon = (await login.locator("svg").boundingBox())!;
  const label = (await login.locator("span").boundingBox())!;
  const bounds = (await login.boundingBox())!;
  expect(bounds.width).toBeCloseTo(label.x + label.width - icon.x, 0);

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
