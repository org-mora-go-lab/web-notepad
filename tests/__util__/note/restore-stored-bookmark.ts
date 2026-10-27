import type { Page } from "@playwright/test";

import { seedStoredStateOnLoad } from "../state";
import { openBookmarksPanel } from "../workspace";

type BookmarkMetadata = {
  tabColor?: string;
  selectedLines?: unknown[];
};

export async function restoreStoredBookmark(
  page: Page,
  { tabColor, selectedLines }: BookmarkMetadata,
) {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      {
        id: "ungrouped",
        name: "Ungrouped",
        tabs: [{ id: "tab-1", content: "" }],
        bookmarks: [
          {
            id: "old-bookmark",
            sourceTabId: "closed-note",
            title: "Old bookmark",
            content: "one\ntwo\nthree",
            tabColor,
            selectedLines,
            createdAt: 1,
          },
        ],
      },
    ],
  });
  await openBookmarksPanel(page);
  await page.getByRole("button", { name: "Open", exact: true }).click();
}
