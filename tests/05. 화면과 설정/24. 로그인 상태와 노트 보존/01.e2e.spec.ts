import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { authProfile } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("1. 로그인 계정은 별도 Logout 아이콘 없이 닉네임과 Logout 동작을 제공한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await page.goto("/");
  await expect(
    page.getByRole("button", {
      name: authProfile.nickname + " · Account menu",
    }),
  ).toBeEnabled();
  await expect(page.locator("a.auth-command")).toHaveCount(0);
  await expect(page.locator("button.auth-command .lucide-log-out")).toHaveCount(
    0,
  );
  const name = page.locator("button.auth-command > span");
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.locator("button.auth-command").hover();
  await expect(page.locator("button.auth-command")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(name).toHaveCSS("font-size", "15.32px");
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(name).toHaveCSS("font-size", "13.2px");
});
