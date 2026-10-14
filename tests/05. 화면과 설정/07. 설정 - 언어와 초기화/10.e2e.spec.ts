import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel } from "../../__util__";
import { languageRadio, settingsPanel } from "../__util__";

test("10. 잘못된 저장 언어를 English와 문서 lang=en으로 복원한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  await page.evaluate((key) => {
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.state.settings.language = "fr";
    localStorage.setItem(key, JSON.stringify(stored));
  }, STORAGE_KEY);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(settingsPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(languageRadio(page, "English")).toBeChecked();
  await expect(settingsPanel(page).locator("h2")).toHaveText("Settings");
});
