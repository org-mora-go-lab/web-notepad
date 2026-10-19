import { expect, test } from "@playwright/test";

import { openBookmarksPanel } from "../../__util__";

test("2. 북마크 패널은 Bookmarks 이름의 complementary 랜드마크다", async ({ page }) => {
  await page.goto("/");
  await openBookmarksPanel(page);
  await expect(page.getByRole("complementary", { name: "Bookmarks" })).toBeVisible();
});
