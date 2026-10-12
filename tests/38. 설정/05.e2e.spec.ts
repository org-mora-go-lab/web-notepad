import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../__util__";
import { settingsPanel, tabColorRadio } from "./__util__";

test("5. 다른 순번에서 사용 중인 색상을 선택하면 두 순번의 색상을 서로 바꾼다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);

  await tabColorRadio(page, 1, "Red").check();
  await expect(tabColorRadio(page, 1, "Red")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Gray")).toBeChecked();
  await expect(tabColorRadio(page, 3, "Green")).toBeChecked();
  await expect(settingsPanel(page).locator(".setting-hint")).toContainText("Red → Gray → Green");

  await tabColorRadio(page, 3, "Gray").check();
  await expect(tabColorRadio(page, 2, "Green")).toBeChecked();
  await expect(tabColorRadio(page, 3, "Gray")).toBeChecked();
  await expect(settingsPanel(page).locator(".setting-hint")).toContainText("Red → Green → Gray");
});
