import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("1. 푸터의 BOOKMARK 왼쪽 SEARCH 명령을 선택하면 전체 검색 팝업을 연다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  const search = page.locator(".footer .global-search-command");
  const bookmark = page.locator(".footer .bookmark-command");
  await expect(search).toBeVisible();
  expect((await search.boundingBox())!.x).toBeLessThan((await bookmark.boundingBox())!.x);

  await openGlobalSearchPanel(page);
  await expect(page.locator("#global-search-popup")).toHaveAttribute("open", "");
});
