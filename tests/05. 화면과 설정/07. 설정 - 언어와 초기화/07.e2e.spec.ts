import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { fontScaleRadio, languageRadio, settingsPanel } from "../__util__";

test("7. 설정 초기화를 Cancel로 취소하면 현재 설정과 패널을 유지한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await fontScaleRadio(page, "120%").check();
  await languageRadio(page, "한국어").check();
  const reset = panel.locator(".setting-reset");
  const popup = page.getByRole("alertdialog", { name: "설정 초기화" });

  await reset.click();
  await popup.getByRole("button", { name: "취소", exact: true }).click();
  await expect(popup).toBeHidden();
  await expect(fontScaleRadio(page, "120%")).toBeChecked();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(fontScaleRadio(page, "120%")).toBeChecked();
  await expect(languageRadio(page, "한국어")).toBeChecked();
});
