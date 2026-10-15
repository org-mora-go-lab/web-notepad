import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("2. SEARCH는 메뉴와 푸터에서 제외하고 헤더 메뉴 왼쪽에 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await trigger.click();
    await expect(page.getByRole("menuitem", { name: "SEARCH", exact: true })).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(page.locator(".footer .global-search-command")).toHaveCount(0);
    const search = page.locator(".header .global-search-command");
    expect((await search.boundingBox())!.x).toBeLessThan((await trigger.boundingBox())!.x);
  }
});
