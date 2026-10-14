import { expect, test } from "@playwright/test";

import { bookmarksCommand } from "../../__util__";

test("5. 북마크 검색 입력의 Cmd+A는 검색어 전체를 선택한다", async ({ page }) => {
  await page.goto("/");
  await bookmarksCommand(page).click();
  const input = page.locator('#bookmarks-panel input[aria-label="Search bookmarks"]');
  const query = "북마크 검색어";
  await input.fill(query);
  await page.keyboard.press("Meta+a");
  await expect.poll(() => input.evaluate((element) => {
    const target = element as HTMLInputElement;
    return [document.activeElement === target, target.selectionStart, target.selectionEnd];
  })).toEqual([true, 0, query.length]);
});
