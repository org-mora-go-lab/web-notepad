import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("6. Escape로 전체 검색을 닫으면 검색어를 초기화한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  const command = page.locator(".global-search-command");
  await command.press("Enter");
  const search = page.getByRole("searchbox", { name: "전체 검색" });
  await search.fill("Work");
  await page.keyboard.press("Escape");
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "true");
  await command.press("Enter");
  await expect(search).toHaveValue("");
  await expect(page.locator(".global-search-empty-state")).toHaveText("Enter a search term");
});