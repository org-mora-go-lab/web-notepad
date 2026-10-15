import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { fontScaleRadio, languageRadio, settingsPanel, tabColorRadio } from "../__util__";

test("4. Reset은 모든 설정을 기본값으로 되돌린다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await fontScaleRadio(page, "120%").check();
  await tabColorRadio(page, 1, "Pink").check();
  await panel.getByRole("radio", { name: "On", exact: true }).check();
  await panel.getByRole("radio", { name: "Left", exact: true }).check();
  await languageRadio(page, "한국어").check();

  await panel.locator(".setting-reset").click();
  await page
    .getByRole("alertdialog", { name: "설정 초기화" })
    .getByRole("button", { name: "초기화", exact: true })
    .click();

  await expect(panel.locator("h2")).toHaveText("Settings");
  await expect(fontScaleRadio(page, "100%")).toBeChecked();
  await expect(tabColorRadio(page, 1, "Orange")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Green")).toBeChecked();
  await expect(tabColorRadio(page, 3, "Red")).toBeChecked();
  await expect(languageRadio(page, "English")).toBeChecked();
  await expect(panel.getByRole("radio", { name: "Off", exact: true })).toBeChecked();
  await expect(panel.getByRole("radio", { name: "Right", exact: true })).toBeChecked();
});
