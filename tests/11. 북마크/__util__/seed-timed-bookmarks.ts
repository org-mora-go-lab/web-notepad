import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { bookmarksCommand, seedStoredStateOnLoad } from "../../__util__";

// Seeds a short-titled and a long-titled bookmark created at 2026-10-11 11:30 UTC and opens the bookmark panel.
export async function seedTimedBookmarks(page: Page) {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab", "")], {
      bookmarks: ["Short", "Long bookmark title for fixed timestamp layout"].map((title, index) => ({
        id: `bookmark-${index}`,
        sourceTabId: `missing-tab-${index}`,
        title,
        content: title,
        tabColor: "green",
        selectedLines: [],
        createdAt: Date.UTC(2026, 9, 11, 11, 30),
        updatedAt: Date.UTC(2026, 9, 11, 11, 30),
      })),
    })],
  });
  await bookmarksCommand(page).click();
}
