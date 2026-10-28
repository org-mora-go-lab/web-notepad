import { expect, test } from "@playwright/test";

import { authProfile, signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("9. 마이페이지 프로필 이미지와 사용자 이름을 1.2배 크기로 표시한다", async ({
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
  const profile = page.locator(".my-page-profile:not(.is-loading)");
  const image = profile.locator("img");
  await expect(image).toBeVisible();
  const bounds = (await image.boundingBox())!;
  expect(bounds.width).toBeCloseTo(76.8, 1);
  expect(bounds.height).toBeCloseTo(76.8, 1);
  const nameSize = await profile
    .getByRole("heading", { name: authProfile.nickname })
    .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  const fontScale = await page.evaluate(() =>
    Number(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--font-scale",
      ),
    ),
  );
  expect(nameSize).toBeCloseTo(24 * fontScale, 1);
});
