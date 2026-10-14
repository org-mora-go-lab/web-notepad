import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel, waitForStoredState } from "../../__util__";
import { settingsPanel } from "../__util__";

test("6. 잘못된 Panel Slide 저장값을 Off로 복원한다", async ({ page }) => {
  await page.goto("/");
  await waitForStoredState(page);
  await page.evaluate((key) => {
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.state.settings.panelSlide = "yes";
    localStorage.setItem(key, JSON.stringify(stored));
  }, STORAGE_KEY);
  await page.reload();

  await expect(page.locator(".home")).toHaveAttribute("data-panel-slide", "off");
  await openSettingsPanel(page);
  await expect(settingsPanel(page).getByRole("radio", { name: "Off", exact: true })).toBeChecked();
});
