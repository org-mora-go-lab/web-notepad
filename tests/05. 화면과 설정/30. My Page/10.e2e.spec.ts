import { expect, test } from "@playwright/test";

import { authProfile, signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("10. 마이페이지 프로필 이미지는 hover해도 원형을 유지한다", async ({
  page,
  context,
}) => {
  await page.route("https://example.test/avatar.svg", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"/>',
    }),
  );
  await authenticateBrowser(
    context,
    signedSession({
      ...authProfile,
      profileImageUrl: "https://example.test/avatar.svg",
      expiresAt: Date.now() + 300000,
    }),
  );
  await page.goto("/my-page");
  const avatar = page.locator(".my-page-profile:not(.is-loading) img");
  await expect(avatar).toBeVisible();
  await avatar.hover();
  await expect(avatar).toHaveCSS("border-radius", "50%");
  await expect(avatar).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(avatar).toHaveCSS("box-shadow", "none");
});
