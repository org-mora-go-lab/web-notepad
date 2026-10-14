import { expect, test } from "@playwright/test";

import { openClosedPanel, openPanel, openSettingsPanel, openShortcutsPanel } from "../../__util__";

test("2. MENU의 SHORTCUT·CLOSED·SETTINGS·SEARCH 명령으로 각 패널을 열고 SHORTCUT은 PC에서만 표시한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('.footer [aria-controls="shortcuts-panel"]')).toHaveCount(0);

  await openShortcutsPanel(page);
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "Close Shortcut (mac)" }).click();
  await openClosedPanel(page);
  await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "Close Closed" }).click();
  await openSettingsPanel(page);
  await expect(page.locator("#settings-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "Close Settings" }).click();
  await openPanel(page, "global-search-panel");
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "false");
});
