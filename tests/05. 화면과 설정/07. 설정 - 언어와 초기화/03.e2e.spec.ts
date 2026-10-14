import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel } from "../../__util__";
import { fontScaleRadio, languageRadio, settingsPanel, tabColorRadio } from "../__util__";

test("3. 고정 버튼 왼쪽의 설정 초기화 버튼은 확인 팝업에서 Reset을 선택한 경우에만 폰트 크기·탭 색상 순서·언어를 기본값으로 되돌리고 취소하면 유지한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  const reset = panel.getByRole("button", { name: "설정 초기화", exact: true });
  const close = panel.getByRole("button", { name: "설정 닫기", exact: true });
  await expect(panel).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  const pinBounds = (await panel.locator(".side-panel-pin").boundingBox())!;
  const resetBounds = (await reset.boundingBox())!;
  const closeBounds = (await close.boundingBox())!;
  expect(resetBounds.x + resetBounds.width).toBeLessThanOrEqual(closeBounds.x);
  expect(resetBounds.x + resetBounds.width).toBeLessThanOrEqual(pinBounds.x);
  expect(pinBounds.x + pinBounds.width).toBeLessThanOrEqual(closeBounds.x);
  expect(resetBounds.width).toBeCloseTo(closeBounds.width, 0);
  expect(resetBounds.height).toBeCloseTo(closeBounds.height, 0);

  await fontScaleRadio(page, "120%").check();
  await tabColorRadio(page, 1, "Pink").check();
  await panel.getByRole("radio", { name: "On", exact: true }).check();
  await languageRadio(page, "한국어").check();
  await expect(panel.locator("h2")).toHaveText("설정");

  const popup = page.getByRole("alertdialog", { name: "설정 초기화" });
  await reset.click();
  await expect(popup).toBeVisible();
  await expect(popup).toContainText("모든 설정이 기본값으로 돌아갑니다. 초기화하시겠습니까?");
  await expect(popup.getByRole("button", { name: "취소", exact: true })).toBeFocused();
  await popup.getByRole("button", { name: "취소", exact: true }).click();
  await expect(popup).toBeHidden();
  await expect(fontScaleRadio(page, "120%")).toBeChecked();
  await expect(panel.locator("h2")).toHaveText("설정");

  await reset.click();
  await page.keyboard.press("Escape");
  await expect(popup).toBeHidden();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(languageRadio(page, "한국어")).toBeChecked();

  await reset.click();
  await popup.getByRole("button", { name: "초기화", exact: true }).click();
  await expect(popup).toBeHidden();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(panel.locator("h2")).toHaveText("Settings");
  await expect(fontScaleRadio(page, "100%")).toBeChecked();
  await expect(tabColorRadio(page, 1, "Gray")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Green")).toBeChecked();
  await expect(tabColorRadio(page, 3, "Purple")).toBeChecked();
  await expect(languageRadio(page, "English")).toBeChecked();
  await expect(panel.getByRole("radio", { name: "Off", exact: true })).toBeChecked();
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).state.settings, STORAGE_KEY))
    .toEqual({ fontScale: 1, tabColorCycle: ["gray", "green", "purple"], language: "en", panelSlide: false, panelPosition: "right" });
});
