import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { fontScaleRadio, languageRadio, settingsPanel, tabColorRadio } from "../__util__";

test("4. 탭 색상만 초기화하면 비기본 폰트 크기와 한국어 설정을 유지한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await fontScaleRadio(page, "110%").check();
  await tabColorRadio(page, 1, "Pink").check();
  await languageRadio(page, "한국어").check();
  await panel.getByRole("button", { name: "탭 색상 초기화", exact: true }).click();
  await expect(fontScaleRadio(page, "110%")).toBeChecked();
  await expect(languageRadio(page, "한국어")).toBeChecked();
  await expect(panel.getByRole("radiogroup", { name: "탭 색상 1" })
    .getByRole("radio", { name: "그레이", exact: true })).toBeChecked();
});
