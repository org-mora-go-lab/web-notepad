import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { authProfile, signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("1. PC 계정 영역을 좌우 4px씩 줄이고 아이콘 hover 효과를 제거한다", async ({
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
  expect(container.width).toBeCloseTo(84.8, 1);
  expect(button.width).toBeCloseTo(container.width, 1);

  const commands = [
    page.locator(".group-select-command"),
    page.locator(".dashboard-command"),
    account,
  ];
  for (const command of commands) {
    await command.hover();
    const hoverDecoration = await command.evaluate((element) => {
      const style = getComputedStyle(element, "::after");
      return [style.content, style.borderLeftWidth, style.borderRightWidth];
    });
    expect(hoverDecoration).toEqual(["none", "0px", "0px"]);
  }
});
