import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { languageRadio, settingsPanel } from "../__util__";

test("5. 한국어 MENU의 사용 가이드는 1단계부터 열리고 이전 버튼을 비활성화한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const settings = settingsPanel(page);
  await languageRadio(page, "한국어").check();
  await settings.getByRole("button", { name: "설정 닫기", exact: true }).click();
  await page.getByRole("button", { name: "메뉴", exact: true }).click();
  await page.getByRole("menuitem", { name: "사용 가이드", exact: true }).click();

  const guide = page.getByRole("dialog");
  await expect(guide.getByRole("heading", { name: "사용 가이드" })).toBeVisible();
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 10");
  await expect(guide.getByRole("button", { name: "이전", exact: true })).toBeDisabled();
});
