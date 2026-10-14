import { expect, test } from "@playwright/test";

import { chooseTabMenuItem, readStoredState } from "../../__util__";

test("2. 탭 메뉴에서 북마크를 추가하면 생성 시각을 보관한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("bookmark timestamp");
  const beforeBookmark = Date.now();
  await chooseTabMenuItem(page, "Bookmark");

  const createdAt = (await readStoredState(page)).groups[0].bookmarks[0].createdAt;
  expect(createdAt).toBeGreaterThanOrEqual(beforeBookmark);
  expect(createdAt).toBeLessThanOrEqual(Date.now());
});
