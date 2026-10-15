import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("6. 북마크 검색 결과를 우측에 표시하고 검색어를 하이라이트한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  await page.getByRole("searchbox", { name: "Search everything" }).fill("Work");
  await page.getByRole("button", { name: "Preview bookmark Work plan" }).click();

  const preview = page.getByRole("region", { name: "Selected tab preview" });
  await expect(preview).toContainText("Work plan");
  await expect(preview).toContainText("Work");
  await expect(preview).toContainText("Work quarterly goals");
  await expect(preview.locator(".search-highlight")).toHaveText([
    "Work",
    "Work",
    "Work",
  ]);
  await expect(page.locator("textarea")).toHaveValue("Current note");
  await expect(page.locator("#global-search-popup")).toHaveAttribute("open", "");
});
