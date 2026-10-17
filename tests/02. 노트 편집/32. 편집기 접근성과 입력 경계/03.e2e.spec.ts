import { expect, test } from "@playwright/test";

test("3. 편집기는 브라우저 맞춤법 검사를 비활성화한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("textarea")).toHaveAttribute("spellcheck", "false");
});
