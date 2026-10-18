import { expect, test } from "@playwright/test";

import { openBookmarksPanel } from "../../__util__";

test("6. 열린 사이드 패널의 닫기 버튼은 패널 이름을 포함한다", async ({ page }) => {
  await page.goto("/");
  await openBookmarksPanel(page);
  await expect(page.getByRole("button", { name: "Close Bookmarks" })).toBeVisible();
});
