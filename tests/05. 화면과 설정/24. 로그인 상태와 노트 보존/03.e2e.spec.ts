import { expect, test } from "@playwright/test";

import { authProfile, signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("3. 프로필 이미지가 있는 계정은 실제 이미지를 대체 아이콘 없이 표시한다", async ({
  page,
  context,
}) => {
  await page.route("https://example.test/avatar.svg", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="red"/></svg>',
    }),
  );
  await authenticateBrowser(
    context,
    signedSession({
      ...authProfile,
      profileImageUrl: "https://example.test/avatar.svg",
      expiresAt: Date.now() + 60000,
    }),
  );
  await page.goto("/");
  const image = page.locator("button.auth-command img");
  await expect(image).toBeVisible();
  const bounds = (await image.boundingBox())!;
  expect(bounds.width).toBeCloseTo(28.8, 1);
  expect(bounds.height).toBeCloseTo(28.8, 1);
  await expect
    .poll(() =>
      image.evaluate((element: HTMLImageElement) => element.naturalWidth),
    )
    .toBe(8);
  await expect(
    page.locator("button.auth-command .lucide-circle-user-round"),
  ).toHaveCount(0);
});
