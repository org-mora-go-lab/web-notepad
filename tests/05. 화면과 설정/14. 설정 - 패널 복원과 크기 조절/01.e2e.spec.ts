import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel, waitForStoredState } from "../../__util__";

test("1. 잘못된 Panel Position 저장값은 Right로 복원한다", async ({ page }) => {
  await page.goto("/");
  await waitForStoredState(page);
  await page.evaluate((key) => {
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.state.settings.panelPosition = "center";
    localStorage.setItem(key, JSON.stringify(stored));
  }, STORAGE_KEY);
  await page.reload();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-position", "right");
  await openSettingsPanel(page);
  await expect(page.locator("#settings-panel").getByRole("radio", { name: "Right", exact: true })).toBeChecked();
});
