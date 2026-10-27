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
      expiresAt: Date.now() + 300000,
    }),
  );
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/my-page");
  await expect(page.locator(".my-page-metrics")).toBeVisible();
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
});
