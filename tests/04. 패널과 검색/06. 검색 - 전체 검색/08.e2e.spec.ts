import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("8. Search closed 결과는 검색어를 유지한 Closed 패널을 열고 탭을 복원하지 않는다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  await page.getByRole("searchbox", { name: "Search everything" }).fill("Archived");
  await expect(page.locator(".global-search-closed .global-search-result")).toHaveCount(2);
  await page.getByRole("button", { name: "View closed tab result Archived draft" }).click();
  await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(page.getByRole("searchbox", { name: "Search closed" })).toHaveValue("Archived");
  await expect(page.locator(".closed-item")).toHaveCount(2);
  await expect(page.locator("textarea")).toHaveValue("Current note");
  await expect(page.getByRole("tab")).toHaveCount(1);
});
