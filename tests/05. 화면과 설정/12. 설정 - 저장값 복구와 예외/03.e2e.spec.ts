import { expect, test } from "@playwright/test";

import { expectCssPx, openSettingsPanel } from "../../__util__";
import { fontScaleRadio, settingsPanel } from "../__util__";

test("3. 폰트 비율을 바꾸면 설정 초기화 확인 팝업 글자 크기에도 즉시 적용한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  await fontScaleRadio(page, "120%").check();
  await settingsPanel(page).getByRole("button", { name: "Reset settings", exact: true }).click();
  const popup = page.getByRole("alertdialog", { name: "Reset settings" });
  await expect(popup).toBeVisible();
  await expectCssPx(popup.getByRole("heading"), "fontSize", 19.2);
  await expectCssPx(popup.locator("p"), "fontSize", 16.8);
});
