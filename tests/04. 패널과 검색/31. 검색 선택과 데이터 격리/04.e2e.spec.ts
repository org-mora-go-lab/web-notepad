import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("4. 새 검색어에 선택한 북마크가 없으면 오래된 미리보기를 숨긴다", async ({
  page,
}) => {
  await seedSearchWorkspace(page, [
    createBookmarkFixture("b1", "gone", "Alpha preview"),
    createBookmarkFixture("b2", "other", "Beta preview"),
  ]);
  await openGlobalSearchPanel(page);
  const search = page.getByRole("searchbox", { name: "Search everything" });
  await search.fill("Alpha");
  await page
    .getByRole("button", { name: "Preview bookmark Alpha preview" })
    .click();
  await expect(page.locator(".global-search-preview")).toBeVisible();
  await search.fill("Beta");
  await expect(
    page.getByRole("button", { name: "Preview bookmark Beta preview" }),
  ).toBeVisible();
  await expect(page.locator(".global-search-preview")).toHaveCount(0);
});
