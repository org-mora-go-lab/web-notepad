import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("1. 우측 상단에는 탭과 겹치지 않는 카카오 로그인·검색 아이콘을 표시한다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const search = page.locator(".header .global-search-command");
    const login = page.getByRole("link", { name: "Continue with Kakao" });
    const bounds = (await search.boundingBox())!;
    const footerPaddingRight = await page.locator(".footer").evaluate((footer) => {
      const target = window.matchMedia("(max-width: 512px)").matches
        ? footer.querySelector(".status-meta")!
        : footer;
      return parseFloat(getComputedStyle(target).paddingRight);
    });
    expect(viewport.width - bounds.x - bounds.width).toBeCloseTo(footerPaddingRight, 1);
    const tabsBounds = (await page.locator(".tabs-scroll").first().boundingBox())!;
    const loginBounds = (await login.boundingBox())!;
    expect(tabsBounds.x + tabsBounds.width).toBeLessThanOrEqual(loginBounds.x + 1);
    expect(loginBounds.x + loginBounds.width).toBeLessThanOrEqual(bounds.x + 1);
    await expect(search.locator("svg")).toHaveCSS("width", "22px");
    await expect(page.getByRole("button", { name: "MENU", exact: true })).toHaveCount(0);
  }
});
