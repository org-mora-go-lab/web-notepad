import { expect, test } from "@playwright/test";

import { chooseTabMenuItem, readStoredState } from "../../__util__";

test("1. 탭 메뉴에서 북마크를 추가하면 제목과 내용을 보관한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("bookmark title\nbookmark content");
  await chooseTabMenuItem(page, "Bookmark");

  expect((await readStoredState(page)).groups[0].bookmarks[0]).toMatchObject({
    title: "bookmark title",
    content: "bookmark title\nbookmark content",
  });
});
