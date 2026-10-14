import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, openClosedPanel } from "../../__util__";

test("8. 닫은 탭 검색 결과가 없으면 No search results를 표시한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "searchable closed note");
  await openClosedPanel(page);

  await page.getByRole("searchbox", { name: "Search closed" }).fill("missing");
  await expect(page.locator("#closed-panel .closed-item")).toHaveCount(0);
  await expect(page.locator("#closed-panel .search-empty-state")).toHaveText("No search results");
});
