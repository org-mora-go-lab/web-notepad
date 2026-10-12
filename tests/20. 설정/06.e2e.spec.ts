import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../__constant__";
import { expectCssPx, openSettingsPanel } from "../__util__";
import { closeSettingsPanel, fontScaleRadio, tabColorRadio } from "./__util__";

test("6. 설정한 폰트 크기와 탭 색상 순서는 새로고침 후에도 유지하며 잘못된 저장값은 기본값으로 처리한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  await fontScaleRadio(page, "110%").check();
  await tabColorRadio(page, 2, "Yellow").check();
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).state.settings, STORAGE_KEY))
    .toEqual({ fontScale: 1.1, tabColorCycle: ["gray", "yellow", "purple"], language: "en", panelSlide: false });
  await closeSettingsPanel(page);

  await page.reload();
  await openSettingsPanel(page);
  await expect(fontScaleRadio(page, "110%")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Yellow")).toBeChecked();
  await expectCssPx(page.locator("textarea").first(), "fontSize", 20.9);
  await closeSettingsPanel(page);

  await page.evaluate((key) => {
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.state.settings = { fontScale: 3, tabColorCycle: ["green", "green", "blue"] };
    localStorage.setItem(key, JSON.stringify(stored));
  }, STORAGE_KEY);
  await page.reload();
  await openSettingsPanel(page);
  await expect(fontScaleRadio(page, "100%")).toBeChecked();
  await expect(tabColorRadio(page, 1, "Gray")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Green")).toBeChecked();
  await expect(tabColorRadio(page, 3, "Purple")).toBeChecked();
});
