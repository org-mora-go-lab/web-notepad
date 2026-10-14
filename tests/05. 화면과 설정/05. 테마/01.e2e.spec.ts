import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("1. MENU의 THEME에서 DARK와 LIGHT를 선택할 수 있으며 기본값은 DARK다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await expect(page.getByRole("menuitemradio", { name: "DARK" })).toHaveAttribute("aria-checked", "true");
    await page.getByRole("menuitemradio", { name: "LIGHT" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await expect(page.getByRole("menuitemradio", { name: "LIGHT" })).toHaveAttribute("aria-checked", "true");
    await page.getByRole("menuitemradio", { name: "DARK" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  }
});
