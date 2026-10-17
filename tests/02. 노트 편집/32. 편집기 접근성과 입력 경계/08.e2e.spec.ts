import { expect, test } from "@playwright/test";

test("8. 여러 줄 입력은 논리 줄마다 줄 번호를 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("one\ntwo\nthree");
  await expect(page.locator(".line-rail").getByRole("button")).toHaveCount(3);
});
