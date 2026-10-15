import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("6. 북마크 검색 결과를 선택하면 해당 북마크를 연다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  await page.getByRole("searchbox", { name: "Search everything" }).fill("Work plan");
  await page.getByRole("button", { name: "Open bookmark Work plan" }).click();
  await expect(page.locator("textarea")).toHaveValue("Quarterly goals");
});
