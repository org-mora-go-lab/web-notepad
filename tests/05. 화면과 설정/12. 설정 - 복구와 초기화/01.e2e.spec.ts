import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel, waitForStoredState } from "../../__util__";
import { fontScaleRadio } from "../__util__";

test("1. 잘못된 폰트 크기 저장값은 기본값 90%로 복원한다", async ({ page }) => {
  await page.goto("/");
  await waitForStoredState(page);
  await page.evaluate((key) => {
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.state.settings.fontScale = 3;
    localStorage.setItem(key, JSON.stringify(stored));
  }, STORAGE_KEY);
  await page.reload();
  await openSettingsPanel(page);
  await expect(fontScaleRadio(page, "90%")).toBeChecked();
});
