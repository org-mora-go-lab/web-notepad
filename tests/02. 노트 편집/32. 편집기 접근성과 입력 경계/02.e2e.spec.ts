import { expect, test } from "@playwright/test";

test("2. 빈 편집기는 Take a note.. 안내 문구를 표시한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("textarea")).toHaveAttribute(
    "placeholder",
    "Take a note..",
  );
});
