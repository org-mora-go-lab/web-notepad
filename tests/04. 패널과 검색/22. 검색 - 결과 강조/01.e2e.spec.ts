import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { bookmarksCommand, seedStoredStateOnLoad } from "../../__util__";

test("1. 북마크 검색 결과의 제목과 내용에서 일치 키워드를 강조한다", async ({
  page,
}) => {
  const group = createGroupFixture(
    "work",
    "Work",
    [createTabFixture("active-tab", "Current note")],
    {
      bookmarks: [
        {
          id: "bookmark-1",
          sourceTabId: "active-tab",
          title: "Alpha bookmark",
          content: "Read alpha again",
          tabColor: "green",
          selectedLines: [],
          createdAt: 1,
          updatedAt: 1,
        },
      ],
    },
  );
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 2,
  });

  await bookmarksCommand(page).click();
  await page
    .getByRole("searchbox", { name: "Search bookmarks" })
    .fill("ALPHA");
  const highlights = page.locator(".bookmark-item mark.search-highlight");
  await expect(highlights).toHaveText(["Alpha", "alpha"]);
  await expect(highlights.first()).toHaveCSS(
    "background-color",
    "rgba(143, 227, 176, 0.22)",
  );
});
