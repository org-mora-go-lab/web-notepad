import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { moreCommand, seedStoredStateOnLoad } from "../../__util__";

test("5. 오래된 북마크와 연결된 탭 색상을 바꾸면 BOOKMARK 붉은 점을 표시한다", async ({ page }) => {
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

  const dot = moreCommand(page).locator(".status-dot");
  await expect(dot).toHaveCount(0);
  await page.locator(".tab-item.is-active .dirty-dot").click();
  await expect(dot).toBeVisible();
});
