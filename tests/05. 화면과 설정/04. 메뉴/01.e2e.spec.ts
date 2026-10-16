import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("1. 문구 없는 메뉴 아이콘 왼쪽에 검색 아이콘을 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(trigger).toBeInViewport();
    const bounds = (await trigger.boundingBox())!;
    const search = page.locator(".header .global-search-command");
    const searchBounds = (await search.boundingBox())!;
    expect(bounds.y).toBe(0);
    const footerPaddingRight = await page.locator(".footer").evaluate((footer) => {
      const target = window.matchMedia("(max-width: 512px)").matches
        ? footer.querySelector(".status-meta")!
        : footer;
      return parseFloat(getComputedStyle(target).paddingRight);
    });
    expect(viewport.width - bounds.x - bounds.width).toBeCloseTo(footerPaddingRight, 1);
    expect(searchBounds.x + searchBounds.width).toBeCloseTo(bounds.x, 1);
    const tabsBounds = (await page.locator(".tabs-scroll").first().boundingBox())!;
    expect(tabsBounds.x + tabsBounds.width).toBeLessThanOrEqual(bounds.x + 1);
    await expect(trigger.locator("svg")).toBeVisible();
    await expect(trigger.locator("svg")).toHaveClass(/lucide-menu/);
    await expect(trigger).toHaveText("");
    await expect(search.locator("svg")).toHaveClass(/lucide-search/);
    await expect(page.locator(".footer .global-search-command")).toHaveCount(0);
    await trigger.click();
    await expect(page.getByRole("menuitem", { name: "SEARCH", exact: true })).toHaveCount(0);
    await page.keyboard.press("Escape");
  }
});
