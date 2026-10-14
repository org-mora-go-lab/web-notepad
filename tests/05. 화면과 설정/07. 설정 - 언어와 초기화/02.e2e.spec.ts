import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel } from "../../__util__";
import { languageRadio, settingsPanel } from "../__util__";

test("2. 선택한 언어는 새로고침 후에도 유지하고 문서 lang에 반영하며 잘못된 저장값은 English로 처리한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await openSettingsPanel(page);
  await languageRadio(page, "한국어").check();
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).state.settings.language, STORAGE_KEY))
    .toBe("ko");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  // The open panel is restored from the URL on reload.
  await expect(settingsPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(settingsPanel(page).locator("h2")).toHaveText("설정");
  await expect(languageRadio(page, "한국어")).toBeChecked();

  await page.evaluate((key) => {
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.state.settings.language = "fr";
    localStorage.setItem(key, JSON.stringify(stored));
  }, STORAGE_KEY);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  // The open panel is restored from the URL on reload.
  await expect(settingsPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(languageRadio(page, "English")).toBeChecked();
  await expect(settingsPanel(page).locator("h2")).toHaveText("Settings");
});
