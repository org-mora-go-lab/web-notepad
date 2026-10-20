import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("3. 검색어 앞뒤 공백을 제외하고 검색한다", async ({ page }) => {
  await seedSearchWorkspace(page, [
    createBookmarkFixture("b1", "gone", "Trim needle"),
  ]);
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("  needle  ");
  await expect(
    page.getByRole("button", { name: "Preview bookmark Trim needle" }),
  ).toBeVisible();
});
