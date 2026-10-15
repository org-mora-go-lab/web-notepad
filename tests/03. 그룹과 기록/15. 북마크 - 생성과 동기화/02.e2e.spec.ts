import { expect, test } from "@playwright/test";

import { chooseTabMenuItem, readStoredState } from "../../__util__";

test("2. 탭 메뉴에서 기존 북마크를 해제한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("bookmark title\nbookmark content");
  await chooseTabMenuItem(page, "Bookmark");
  await chooseTabMenuItem(page, "Remove bookmark");

  const group = (await readStoredState(page)).groups[0];
  expect(group.bookmarks).toHaveLength(0);
  expect(group.tabs[0].bookmarked).toBe(false);
});
