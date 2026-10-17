import { expect, test } from "@playwright/test";

test("2. 북마크 패널은 Bookmarks 이름의 complementary 랜드마크다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.getByRole("complementary", { name: "Bookmarks" })).toBeVisible();
});
