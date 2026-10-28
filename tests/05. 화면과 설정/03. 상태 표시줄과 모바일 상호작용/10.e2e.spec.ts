import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { authProfile, signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("10. PC 아이콘과 텍스트 버튼은 전체 영역에 동일한 hover 배경을 표시한다", async ({
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
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await page.locator(".group-select-command").click();

  for (const selector of [
    ".system-group-command",
    ".more-command",
    ".group-select-command",
    ".dashboard-command",
  ]) {
    const command = page.locator(selector).first();
    const icon = command.locator("svg").first();
    const label = command.locator("span").last();
    await label.hover();
    await expect(command).toHaveCSS("border-radius", "3px");
    await expect(command).toHaveCSS(
      "background-color",
      "rgba(180, 180, 180, 0.18)",
    );
    await expect(command).toHaveCSS(
      "box-shadow",
      "rgba(180, 180, 180, 0.18) 0px 0px 0px 4px",
    );
    const extension = await command.evaluate((element) => {
      const style = getComputedStyle(element, "::after");
      return {
        top: style.top,
        right: style.right,
        bottom: style.bottom,
        left: style.left,
        borderLeftWidth: style.borderLeftWidth,
        borderRightWidth: style.borderRightWidth,
      };
    });
    expect(extension).toEqual({
      top: "-4px",
      right: "-6px",
      bottom: "-4px",
      left: "-6px",
      borderLeftWidth: "2px",
      borderRightWidth: "2px",
    });
    if (await icon.isVisible()) {
      await icon.hover();
      await expect(icon).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    }
  }

  const account = page.locator("button.auth-command");
  const avatar = account.locator("img");
  await expect(avatar).toBeVisible();
  await account.locator("span").hover();
  await expect(account).toHaveCSS(
    "background-color",
    "rgba(180, 180, 180, 0.18)",
  );
  await expect(account).toHaveCSS(
    "box-shadow",
    "rgba(180, 180, 180, 0.18) 0px 0px 0px 4px",
  );
  expect(
    await account.evaluate(
      (element) => getComputedStyle(element, "::after").borderLeftWidth,
    ),
  ).toBe("2px");
  await avatar.hover();
  await expect(avatar).toHaveCSS("border-radius", "50%");
  await expect(avatar).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
});
