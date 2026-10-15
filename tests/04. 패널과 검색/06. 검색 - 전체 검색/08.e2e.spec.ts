import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("8. 닫은 탭은 전체 검색 결과에 포함하지 않는다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  await page.getByRole("searchbox", { name: "Search everything" }).fill("Archived");
  await expect(page.locator(".global-search-closed .global-search-result")).toHaveCount(0);
  await expect(page.locator(".global-search-empty-state")).toHaveText("No search results");
  await expect(page.locator("textarea")).toHaveValue("Current note");
  await expect(page.getByRole("tab")).toHaveCount(1);
});
