import { expect, test } from "@playwright/test";

import { bookmarkActiveTab, readStoredState } from "../../__util__";

test("4. 원본 탭의 내용이 바뀌면 연결된 북마크의 제목과 내용을 갱신한다", async ({
  page,
}) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "original\nsecond");
  await page.locator("textarea").fill("updated\nsecond");

  await expect
    .poll(async () => {
      const bookmark = (await readStoredState(page)).groups[0].bookmarks[0];
      return { title: bookmark.title, content: bookmark.content };
    })
    .toEqual({ title: "updated", content: "updated\nsecond" });
});
