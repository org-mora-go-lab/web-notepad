import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { openBoard } from "../../__util__";

test("8. 보드 진입 시 검색창에 자동 포커스하지 않는다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await openBoard(page);

    const search = page.getByRole("searchbox", {
      name: "Search shared groups",
    });
    await expect(search).toBeVisible();
    await expect(search).not.toBeFocused();
    await search.click();
    await expect(search).toBeFocused();
  }
});
