import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("4. 북마크 검색 결과를 선택하면 해당 북마크를 연다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await page.locator(".global-search-command").press("Enter");
  await page.getByRole("searchbox", { name: "전체 검색" }).fill("Work plan");
  await page.getByRole("button", { name: "북마크 Work plan 열기" }).click();
  await expect(page.locator("textarea")).toHaveValue("Quarterly goals");
});