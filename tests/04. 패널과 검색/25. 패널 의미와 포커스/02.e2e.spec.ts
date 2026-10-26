import { expect, test } from "@playwright/test";

import { openBookmarksPanel } from "../../__util__";

test("2. 북마크 팝업은 Bookmarks 이름의 비모달 dialog다", async ({ page }) => {
  await page.goto("/");
  await openBookmarksPanel(page);
  await expect(page.getByRole("dialog", { name: "Bookmarks" })).toBeVisible();
});
