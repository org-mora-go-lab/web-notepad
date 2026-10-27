import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../state";

// Restores a pinned "pinned note" tab followed by an active bookmarked "bookmarked note" tab.
export async function createPinnedAndBookmarkedTabs(page: Page) {
  const pinned = createTabFixture("tab-pinned", "pinned note", {
    pinned: true,
  });
  const bookmarked = createTabFixture("tab-bookmarked", "bookmarked note", {
    bookmarked: true,
  });
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [pinned, bookmarked], {
        activeTabId: bookmarked.id,
      }),
    ],
    nextTabNumber: 3,
  });

  return {
    pinnedTab: page.locator(".tab-item").filter({ hasText: "pinned note" }),
    bookmarkedTab: page
      .locator(".tab-item")
      .filter({ hasText: "bookmarked note" }),
  };
}
