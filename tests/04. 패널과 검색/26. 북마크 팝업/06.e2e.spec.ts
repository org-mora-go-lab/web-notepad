import { expect, test } from "@playwright/test";

import { openBookmarksPanel, writeStoredState } from "../../__util__";
import { createBookmarkGroupsState } from "./__fixture__";

test("6. MORE의 BOOKMARK는 모든 그룹의 북마크 내용을 표시한다", async ({
  page,
}) => {
  await writeStoredState(page, createBookmarkGroupsState());
  await openBookmarksPanel(page);

  const items = page.locator("#bookmarks-panel .bookmark-item");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0).locator("strong")).toHaveText("Work note");
  await expect(items.nth(0).locator(".bookmark-item-group")).toHaveText("Work");
  await expect(items.nth(0).locator(".bookmark-item-content")).toHaveText(
    "Work content",
  );
  await expect(items.nth(1).locator("strong")).toHaveText("Home note");
  await expect(items.nth(1).locator(".bookmark-item-group")).toHaveText(
    "Ungrouped",
  );
  await expect(items.nth(1).locator(".bookmark-item-content")).toHaveText(
    "Home content",
  );
});
