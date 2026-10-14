import { expect, test } from "@playwright/test";

test("5. PC MENU의 SHORTCUT은 기존 단축키 패널을 연다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "SHORTCUT" }).click();
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(page.getByRole("menu", { name: "MENU", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /Shortcut/ })).toBeVisible();
});