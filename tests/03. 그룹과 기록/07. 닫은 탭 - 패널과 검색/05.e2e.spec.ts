import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, openClosedPanel } from "../../__util__";

test("5. 닫은 탭 검색창은 Search closed placeholder를 표시한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "searchable closed note");
  await openClosedPanel(page);

  await expect(page.getByRole("searchbox", { name: "Search closed" })).toHaveAttribute(
    "placeholder",
    "Search closed",
  );
});
