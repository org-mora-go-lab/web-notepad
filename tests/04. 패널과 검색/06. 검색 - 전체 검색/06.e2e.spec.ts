import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("6. 북마크 검색 결과를 선택하면 에디터를 열지 않고 우측에 탭을 표시한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  await page.getByRole("searchbox", { name: "Search everything" }).fill("Work plan");
  await page.getByRole("button", { name: "Preview bookmark Work plan" }).click();

  const preview = page.getByRole("region", { name: "Selected tab preview" });
  await expect(preview).toContainText("Work plan");
  await expect(preview).toContainText("Work");
  await expect(preview).toContainText("Quarterly goals");
  await expect(page.locator("textarea")).toHaveValue("Current note");
  await expect(page.locator("#global-search-popup")).toHaveAttribute("open", "");
});
