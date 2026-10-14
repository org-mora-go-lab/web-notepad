import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, openSettingsPanel } from "../../__util__";
import { settingsPanel } from "../__util__";

test("2. LIGHT의 전체 검색 패널과 확인 팝업은 밝은 배경과 짙은 글자를 사용한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "LIGHT" }).click();

  await openGlobalSearchPanel(page);
  const searchDrawer = page.locator("#global-search-panel");
  await expect(searchDrawer).toHaveCSS("background-color", "rgb(247, 250, 248)");
  await page.keyboard.press("Escape");

  await openSettingsPanel(page);
  await settingsPanel(page).getByRole("button", { name: "Reset settings", exact: true }).click();
  const popup = page.getByRole("alertdialog", { name: "Reset settings" });
  await expect(popup).toHaveCSS("background-color", "rgb(233, 239, 235)");
  await expect(popup).toHaveCSS("color", "rgb(32, 38, 36)");
});
