import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { authProfile, signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("1. PC 로그인 계정 이미지와 이름 영역을 20% 줄인다", async ({
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
      expiresAt: Date.now() + 60_000,
    }),
  );
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");

  const account = page.locator("button.auth-command");
  await expect(account.locator("img")).toBeVisible();
  await expect(account.locator("span")).toHaveText(authProfile.nickname);
  const container = (await page.locator(".footer-auth").boundingBox())!;
  const button = (await account.boundingBox())!;
  expect(container.width).toBeCloseTo(116 * 0.8, 1);
  expect(button.width).toBeCloseTo(container.width, 1);
});
