import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("1. 정규식 특수문자가 포함된 검색어는 리터럴 부분 문자열로 검색한다", async ({
  page,
}) => {
  await seedSearchWorkspace(page, [
    createBookmarkFixture("b1", "gone", "Literal [a+b]? result"),
    createBookmarkFixture("b2", "other", "Unrelated ab result"),
  ]);
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("[a+b]?");
  await expect(
    page.locator(".global-search-bookmarks .global-search-result"),
  ).toHaveCount(1);
  await expect(page.locator(".global-search-bookmarks")).toContainText(
    "Literal [a+b]? result",
  );
});
