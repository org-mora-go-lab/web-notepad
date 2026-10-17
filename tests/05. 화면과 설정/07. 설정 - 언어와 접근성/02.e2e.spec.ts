import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel } from "../../__util__";
import { languageRadio, settingsPanel } from "../__util__";

test("2. 선택한 언어를 저장하고 새로고침 후 복원해 문서 lang에 반영한다", async ({ page }) => {
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
  await expect(settingsPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(settingsPanel(page).locator("h2")).toHaveText("설정");
  await expect(languageRadio(page, "한국어")).toBeChecked();
});
