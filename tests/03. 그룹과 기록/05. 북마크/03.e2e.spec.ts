import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { bookmarksCommand, seedStoredStateOnLoad } from "../../__util__";

test("3. 북마크 내용은 제목 줄을 제외한 전체 내용을 항상 펼쳐 표시한다", async ({ page }) => {
  const lines = Array.from({ length: 12 }, (_, index) => `line ${index}`);
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab", "")], {
      bookmarks: [
        ["Bookmark title", ["Bookmark title", "", ...lines].join("\n")],
        ["Title only", "Title only"],
      ].map(([title, content], index) => ({
        id: `bookmark-${index}`,
        sourceTabId: `missing-tab-${index}`,
        title,
        content,
        tabColor: "green",
        selectedLines: [],
        createdAt: 2 - index,
        updatedAt: 2 - index,
      })),
    })],
  });
  await bookmarksCommand(page).click();

  const items = page.locator(".bookmark-item");
  const content = items.first().locator(".bookmark-item-content");
  await expect(items.first().locator(".bookmark-item-heading strong")).toHaveText("Bookmark title");
  await expect(content).toHaveText(lines.join("\n"));
  expect(await content.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);
  await expect(page.getByRole("button", { name: /더보기|간소화/ })).toHaveCount(0);

  const emptyContent = items.last().locator(".bookmark-item-content");
  await expect(emptyContent).toHaveText("");
  await expect(emptyContent).toHaveCSS("height", "30px");
  await expect(emptyContent).toHaveCSS("margin-top", "0px");
});
