import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { bookmarksCommand, expectPanelTimes, seedStoredStateOnLoad } from "../__util__";

test.use({ timezoneId: "UTC" });

test("6. 북마크 시각은 고정된 우측 영역에 영어 날짜와 상세 시간을 두 줄로 표시한다", async ({ page }) => {
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
      })),
    })],
  });
  await bookmarksCommand(page).click();
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await expectPanelTimes(page.locator(".bookmark-item-heading"));
    await expect(page.locator(".bookmark-item-heading strong").last()).toHaveCSS("text-overflow", "ellipsis");
  }
});