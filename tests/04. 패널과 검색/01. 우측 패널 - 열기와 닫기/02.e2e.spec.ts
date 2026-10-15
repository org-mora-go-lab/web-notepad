import { expect, test } from "@playwright/test";

import { openPanel, openSettingsPanel, openShortcutsPanel } from "../../__util__";

test("2. MENU의 SHORTCUT·SETTINGS·SEARCH 명령으로 각 패널을 열고 CLOSED는 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('.footer [aria-controls="shortcuts-panel"]')).toHaveCount(0);

  await openShortcutsPanel(page);
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "Close Shortcut (mac)" }).click();
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "CLOSED", exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await openSettingsPanel(page);
  await expect(page.locator("#settings-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "Close Settings" }).click();
  await openPanel(page, "global-search-panel");
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "false");
});
