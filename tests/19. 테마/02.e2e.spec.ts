import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("2. LIGHT는 밝은 중립 배경과 짙은 글자로 편집기·하단 메뉴·패널·검색을 일관되게 표시한다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await page.getByRole("menuitemradio", { name: "LIGHT" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator(".workspace")).toHaveCSS("background-color", "rgb(250, 252, 251)");
    await expect(page.locator("textarea")).toHaveCSS("color", "rgb(32, 38, 36)");
    await expect(page.locator(".footer")).toHaveCSS("background-color", "rgb(240, 244, 241)");
    await page.locator(".group-select-command").press("Enter");
    await expect(page.locator("#groups-panel")).toHaveCSS("background-color", "rgb(247, 250, 248)");
    await expect(page.locator("#groups-panel .search-field")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await page.getByRole("menuitemradio", { name: "DARK" }).click();
    await expect(page.locator(".workspace")).toHaveCSS("background-color", "rgb(17, 17, 16)");
  }
});
