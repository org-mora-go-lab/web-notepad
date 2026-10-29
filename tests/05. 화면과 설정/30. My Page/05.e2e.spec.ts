import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
test("5. 좁은 모바일에서 긴 프로필 이름과 통계를 화면 안에 배치한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(
    context,
    signedSession({
      id: "my-mobile-" + crypto.randomUUID(),
      nickname: "A very long profile name for mobile layout ".repeat(4),
      profileImageUrl: "/test-user.svg",
      expiresAt: Date.now() + 300000,
    }),
  );
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/my-page");
  await expect(page.locator(".my-page-metrics")).toBeVisible();
  const header = page.locator(".fixed-page-header");
  const back = header.getByRole("link", { name: "Back to notes" });
  const title = header.getByRole("heading", { name: "My Page" });
  const headerBounds = (await header.boundingBox())!;
  const backBounds = (await back.boundingBox())!;
  const titleBounds = (await title.boundingBox())!;
  expect(titleBounds.x + titleBounds.width / 2).toBeCloseTo(160, 1);
  expect(await back.locator("svg").evaluate((icon) => icon.clientWidth)).toBe(
    18,
  );
  const portrait = (await page.locator(".my-page-portrait").boundingBox())!;
  const image = (await page.locator(".my-page-portrait img").boundingBox())!;
  expect(image.width).toBeCloseTo(portrait.width, 0);
  expect(portrait.y + portrait.height - (image.y + image.height)).toBeCloseTo(
    30,
    0,
  );
  expect(
    (await page.locator(".my-page-content").boundingBox())!.y,
  ).toBeGreaterThan(portrait.y + portrait.height);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollHeight <= innerHeight,
    ),
  ).toBe(true);
  const main = page.locator(".my-page");
  await main.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  expect(await main.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  expect((await header.boundingBox())!.y).toBeCloseTo(headerBounds.y, 1);
  expect((await back.boundingBox())!.y).toBeCloseTo(backBounds.y, 1);
});
