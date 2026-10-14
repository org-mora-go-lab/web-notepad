import { expect, test } from "@playwright/test";

import { bookmarkActiveTab, lineButtons, readStoredState } from "../../__util__";

test("8. 원본 탭의 줄 선택이 바뀌면 연결된 북마크의 선택한 줄 번호를 갱신한다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "first\nsecond\nthird");
  await lineButtons(page).nth(2).click();

  await expect.poll(async () => (await readStoredState(page)).groups[0].bookmarks[0].selectedLines)
    .toEqual([2]);
});
