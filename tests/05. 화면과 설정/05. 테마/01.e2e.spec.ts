import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("1. MENU의 THEME에서 radio toggle로 DARK와 LIGHT를 선택하며 기본값은 DARK다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await expect(page.getByRole("radio", { name: "DARK" })).toBeChecked();
    await page.getByRole("radio", { name: "LIGHT" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await expect(page.getByRole("radio", { name: "LIGHT" })).toBeChecked();
    await page.getByRole("radio", { name: "DARK" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  }
});
