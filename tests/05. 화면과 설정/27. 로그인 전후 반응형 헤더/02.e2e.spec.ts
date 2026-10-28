import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("2. 모바일 긴 이름은 말줄임되고 프로필 이미지는 줄어들지 않는다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(
    context,
    signedSession({
      id: "layout-mobile",
      nickname: "아주 긴 카카오톡 프로필 이름이 모바일 헤더에 표시되는 경우",
      profileImageUrl: "https://example.test/avatar.png",
      expiresAt: Date.now() + 60_000,
    }),
  );
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const button = page.locator("button.auth-command");
    await expect(button).toBeVisible();
    const image = button.locator("img");
    const name = button.locator("span");
    await expect(image).toHaveCSS("width", "24px");
    await expect(image).toHaveCSS("height", "24px");
    await expect(name).toHaveCSS("text-overflow", "ellipsis");
    const bounds = await button.evaluate((element) => {
      const buttonBox = element.getBoundingClientRect();
      const imageBox = element.querySelector("img")!.getBoundingClientRect();
      const nameBox = element.querySelector("span")!.getBoundingClientRect();
      return {
        buttonRight: buttonBox.right,
        imageWidth: imageBox.width,
        imageRight: imageBox.right,
        imageBottom: imageBox.bottom,
        nameTop: nameBox.top,
        nameLeft: nameBox.left,
        nameRight: nameBox.right,
        clipped: element.querySelector("span")!.scrollWidth > nameBox.width,
      };
    });
    expect(bounds.imageWidth).toBe(24);
    expect(bounds.imageBottom).toBeLessThanOrEqual(bounds.nameTop);
    expect(bounds.nameRight).toBeLessThanOrEqual(bounds.buttonRight);
    expect(bounds.buttonRight).toBeLessThanOrEqual(width);
    expect(bounds.clipped).toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
});
