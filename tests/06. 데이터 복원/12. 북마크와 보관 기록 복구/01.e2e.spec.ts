import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("1. 북마크 목록에서 ID가 없는 손상 항목만 제거한다", async ({ page }) => {
  await restoreWorkspace(page, {
    bookmarks: [
      null,
      {},
      42,
      createBookmarkFixture("b1", "tab-1", "Kept bookmark"),
    ],
  });
  const bookmarks = (await readActiveGroup(page)).bookmarks;
  expect(bookmarks.map((bookmark) => bookmark.id)).toEqual(["b1"]);
});
