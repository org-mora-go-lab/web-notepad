import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("2. 검색어가 없으면 Enter a search term을 표시한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);

  await expect(page.locator("#global-search-popup")).toHaveAttribute("open", "");
  await expect(page.locator(".global-search-empty-state")).toHaveText("Enter a search term");
});
