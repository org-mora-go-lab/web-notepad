import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("4. 북마크하지 않은 노트 본문은 북마크 검색 결과에 노출하지 않는다", async ({
  page,
}) => {
  await seedSearchWorkspace(page, []);
  await page.locator("textarea").fill("Unbookmarked secret");
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("Unbookmarked secret");
  await expect(page.locator(".global-search-empty-state")).toHaveText(
    "No search results",
  );
});
