import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { bookmarksCommand, lineButtons, seedStoredStateOnLoad } from "../../__util__";

test("9. 오래된 북마크와 연결된 탭의 줄 선택을 바꾸면 BOOKMARK 붉은 점을 표시한다", async ({ page }) => {
  const yesterday = Date.now() - 24 * 60 * 60 * 1000;
  const tab = createTabFixture("tab-old", "first\nsecond", { bookmarked: true });
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
  await expect(dot).toHaveCount(0);
  await lineButtons(page).first().click();
  await expect(dot).toBeVisible();
});
