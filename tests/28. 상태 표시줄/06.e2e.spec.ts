import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { bookmarksCommand, seedStoredStateOnLoad } from "../__util__";

test("6. 오늘 생성·갱신된 북마크가 없으면 붉은 점을 숨기고, 연결된 탭을 오늘 수정하면 다시 표시한다", async ({ page }) => {
  const yesterday = Date.now() - 24 * 60 * 60 * 1000;
  const tab = createTabFixture("tab-old", "Old note", { bookmarked: true });
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [createGroupFixture("ungrouped", "Ungrouped", [tab], {
      bookmarks: [{
        id: "bookmark-tab-old",
        sourceTabId: tab.id,
        title: tab.title,
        content: tab.content,
        tabColor: tab.tabColor,
        selectedLines: [],
        createdAt: yesterday,
        updatedAt: yesterday,
      }],
    })],
  });

  const dot = bookmarksCommand(page).locator(".status-dot");
  await expect(bookmarksCommand(page).locator(".status-label")).toBeVisible();
  await expect(dot).toHaveCount(0);

  const editor = page.locator(".note-area");
  await editor.focus();
  await page.keyboard.press("End");
  await page.keyboard.type(" updated");
  await expect(editor).toHaveValue("Old note updated");
  await expect(dot).toBeVisible();
});
