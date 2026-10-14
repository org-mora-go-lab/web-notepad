import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { fontScaleRadio, languageRadio, settingsPanel } from "../__util__";

test("7. 탭 색상을 셔플하면 비기본 폰트 크기와 한국어 설정을 유지한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await fontScaleRadio(page, "90%").check();
  await languageRadio(page, "한국어").check();
  await panel.getByRole("button", { name: "탭 색상 무작위 선택", exact: true }).click();
  await expect(fontScaleRadio(page, "90%")).toBeChecked();
  await expect(languageRadio(page, "한국어")).toBeChecked();
});
