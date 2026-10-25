import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("1. 우측 상단은 로그인, 하단 더보기는 가이드·설정·검색·북마크를 제공한다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const trigger = page.locator(".footer .more-command");
    const login = page.locator(".header").getByRole("link", { name: "Continue with Kakao" });
    await expect(login).toBeVisible();
    await expect(login).toContainText("LOGIN");
    const bounds = (await login.boundingBox())!;
    expect(bounds.x + bounds.width).toBeCloseTo(viewport.width, 1);
    const icon = (await login.locator("svg").boundingBox())!;
    const label = (await login.locator("span").boundingBox())!;
    expect((icon.x + label.x + label.width) / 2).toBeCloseTo(bounds.x + bounds.width / 2, 1);
    for (const item of [icon, label]) {
      expect(item.y + item.height / 2).toBeCloseTo(bounds.y + bounds.height / 2, 1);
    }
    const tabsBounds = (await page.locator(".tabs-scroll").first().boundingBox())!;
    expect(tabsBounds.x + tabsBounds.width).toBeLessThanOrEqual(bounds.x + 1);
    await trigger.click();
    const menu = page.locator("#footer-more-menu");
    await expect(menu.getByRole("button")).toHaveText(["GUIDE", "SETTINGS", "SEARCH", "Bookmark", "BOARD"]);
    await expect(menu.getByRole("link", { name: "Continue with Kakao" })).toHaveCount(0);
    await expect(menu.getByRole("switch", { name: "THEME" })).toHaveCount(0);
    await expect(menu.getByRole("button", { name: "SHORTCUT" })).toHaveCount(0);
    await page.keyboard.press("Escape");
  }
});
