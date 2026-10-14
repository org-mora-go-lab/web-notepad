import { expect, test } from "@playwright/test";

import { chooseTabMenuItem, lineButtons, readStoredState } from "../../__util__";

test("5. 북마크를 추가하면 선택한 줄 번호를 보관한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("first\nsecond\nthird");
  await lineButtons(page).nth(1).click();
  await lineButtons(page).nth(2).click();
  await chooseTabMenuItem(page, "Bookmark");

  expect((await readStoredState(page)).groups[0].bookmarks[0].selectedLines).toEqual([1, 2]);
});
