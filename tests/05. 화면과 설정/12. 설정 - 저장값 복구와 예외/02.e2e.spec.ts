import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel, waitForStoredState } from "../../__util__";
import { tabColorRadio } from "../__util__";

test("2. 중복되거나 잘못된 탭 색상 순서 저장값은 기본 순서로 복원한다", async ({ page }) => {
  await page.goto("/");
  await waitForStoredState(page);
  await page.evaluate((key) => {
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.state.settings.tabColorCycle = ["green", "green", "blue"];
    localStorage.setItem(key, JSON.stringify(stored));
  }, STORAGE_KEY);
  await page.reload();
  await openSettingsPanel(page);
  await expect(tabColorRadio(page, 1, "Orange")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Green")).toBeChecked();
  await expect(tabColorRadio(page, 3, "Red")).toBeChecked();
});
