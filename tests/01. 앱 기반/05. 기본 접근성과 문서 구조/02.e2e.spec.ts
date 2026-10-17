import { expect, test } from "@playwright/test";

test("2. 기본 문서 언어는 영어로 설정한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
