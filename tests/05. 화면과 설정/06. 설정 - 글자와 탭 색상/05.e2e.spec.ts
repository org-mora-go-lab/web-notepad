import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { settingsPanel, tabColorRadio } from "../__util__";

test("5. 앞 순번에서 뒤 순번이 사용 중인 색상을 선택하면 두 순번의 색상을 서로 바꾼다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);

  await tabColorRadio(page, 1, "Purple").check();
  await expect(tabColorRadio(page, 1, "Purple")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Green")).toBeChecked();
  await expect(tabColorRadio(page, 3, "Gray")).toBeChecked();
  await expect(settingsPanel(page).locator(".setting-hint")).toContainText("Purple → Green → Gray");

  await tabColorRadio(page, 2, "Gray").check();
  await expect(tabColorRadio(page, 2, "Gray")).toBeChecked();
  await expect(tabColorRadio(page, 3, "Green")).toBeChecked();
  await expect(settingsPanel(page).locator(".setting-hint")).toContainText("Purple → Gray → Green");
});
