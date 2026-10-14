import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { fontScaleRadio, languageRadio, settingsPanel } from "../__util__";

test("2. 설정 초기화 팝업의 닫기 버튼은 현재 설정과 설정 패널을 유지한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await fontScaleRadio(page, "120%").check();
  await languageRadio(page, "한국어").check();
  await panel.getByRole("button", { name: "설정 초기화", exact: true }).click();
  const popup = page.getByRole("alertdialog", { name: "설정 초기화" });
  await popup.getByRole("button", { name: "설정 초기화 닫기", exact: true }).click();
  await expect(popup).toBeHidden();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(fontScaleRadio(page, "120%")).toBeChecked();
  await expect(languageRadio(page, "한국어")).toBeChecked();
});
