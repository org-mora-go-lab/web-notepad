import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("2. MENU에는 SEARCH를 표시하지 않고 푸터에서 BOOKMARK 바로 왼쪽에 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await trigger.click();
    await expect(page.getByRole("menuitem", { name: "SEARCH", exact: true })).toHaveCount(0);
    await page.keyboard.press("Escape");
    const search = page.locator(".footer .global-search-command");
    const bookmark = page.locator(".footer .bookmark-command");
    expect((await search.boundingBox())!.x).toBeLessThan((await bookmark.boundingBox())!.x);
  }
});
