import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("4. 북마크하지 않은 노트는 탭 결과에 표시하고 북마크 결과와 구분한다", async ({
  page,
}) => {
  await seedSearchWorkspace(page, []);
  await page.locator("textarea").fill("Unbookmarked secret");
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("Unbookmarked secret");
  await expect(
    page.locator(".global-search-tabs").getByRole("button", {
      name: "Open tab Unbookmarked secret",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.locator(".global-search-bookmarks .global-search-result"),
  ).toHaveCount(0);
});
