import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("4. 그룹·북마크·모든 그룹의 닫은 탭을 대소문자 구분 없이 부분 검색한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  const search = page.getByRole("searchbox", { name: "전체 검색" });
  await search.fill("wOr");
  await expect(page.locator(".global-search-groups .global-search-result")).toHaveCount(1);
  await expect(page.locator(".global-search-bookmarks .global-search-result")).toHaveCount(1);
  await expect(page.locator(".global-search-closed .global-search-result")).toHaveCount(1);
  await search.fill("gOaLs");
  await expect(page.locator(".global-search-bookmarks .global-search-result")).toHaveCount(1);
  await search.fill("aRcHiVeD");
  await expect(page.locator(".global-search-closed .global-search-result")).toHaveCount(2);
});
