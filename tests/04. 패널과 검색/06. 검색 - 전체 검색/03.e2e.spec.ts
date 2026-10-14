import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("3. 검색어가 없거나 결과가 없으면 전체 검색 빈 상태 문구를 표시한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator(".global-search-empty-state")).toHaveText("Enter a search term");
  await page.getByRole("searchbox", { name: "전체 검색" }).fill("No matching term");
  await expect(page.locator(".global-search-empty-state")).toHaveText("No search results");
});
