import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";

test("1. PC와 모바일 북마크 패널은 검색창 없이 모든 북마크를 표시한다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await writeStoredState(page, {
      activeGroupId: "ungrouped",
      groups: [createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "Note")], {
        bookmarks: ["Alpha note", "Beta note", "Gamma note"].map((title, index) => ({
          id: `bookmark-${index}`, sourceTabId: `source-${index}`, title, content: `${title}\nBody ${index}`,
          tabColor: "green" as const, selectedLines: [], createdAt: 3 - index, updatedAt: 3 - index,
        })),
      })],
    });
    await openPanel(page, "bookmarks-panel");
    const panel = page.locator("#bookmarks-panel");
    await expect(panel.getByRole("searchbox")).toHaveCount(0);
    await expect(panel.locator(".search-field")).toHaveCount(0);
    await expect(panel.locator(".bookmark-item-heading strong")).toHaveText(["Alpha note", "Beta note", "Gamma note"]);
    await expect(panel.locator(".bookmark-item-content")).toHaveText(["Body 0", "Body 1", "Body 2"]);
  }
});
