import { expect, test } from "@playwright/test";

test("3. PC 화면에서 문서에 가로 오버플로를 만들지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
