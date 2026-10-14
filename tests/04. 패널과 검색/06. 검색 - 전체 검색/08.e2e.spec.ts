import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("8. Escape로 전체 검색을 닫으면 검색어를 초기화한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  const search = page.getByRole("searchbox", { name: "전체 검색" });
  await search.fill("Work");
  await page.keyboard.press("Escape");
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "true");
  await openGlobalSearchPanel(page);
  await expect(search).toHaveValue("");
  await expect(page.locator(".global-search-empty-state")).toHaveText("Enter a search term");
});
