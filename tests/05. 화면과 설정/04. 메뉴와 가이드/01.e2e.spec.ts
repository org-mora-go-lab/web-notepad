import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("1. 우측 상단 메뉴는 가이드·설정·검색·카카오 로그인을 제공한다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const trigger = page.locator(".header .additional-tools-trigger");
    const bounds = (await trigger.boundingBox())!;
    const footerPaddingRight = await page.locator(".footer").evaluate((footer) => {
      const target = window.matchMedia("(max-width: 512px)").matches
        ? footer.querySelector(".status-meta")!
        : footer;
      return parseFloat(getComputedStyle(target).paddingRight);
    });
    expect(viewport.width - bounds.x - bounds.width).toBeCloseTo(footerPaddingRight, 1);
    const tabsBounds = (await page.locator(".tabs-scroll").first().boundingBox())!;
    expect(tabsBounds.x + tabsBounds.width).toBeLessThanOrEqual(bounds.x + 1);
    await trigger.click();
    const menu = page.locator("#additional-tools-menu");
    await expect(menu.getByRole("button")).toHaveText(["GUIDE", "SETTINGS", "SEARCH"]);
    await expect(menu.getByRole("link", { name: "Continue with Kakao" })).toBeVisible();
    await page.keyboard.press("Escape");
  }
});
