import { expect, test } from "@playwright/test";

import { addTabButton, deleteTabPopup } from "../../__util__";

test("3. 확인 팝업에서 같은 닫기 단축키를 다시 누르면 요청한 탭을 삭제한다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  const editor = page.locator("textarea");
  await editor.fill("Keep the first note");
  await addTabButton(page).click();
  await editor.fill("Shortcut close confirmation");

  await page.keyboard.press("Alt+Backspace");
  await expect(deleteTabPopup(page)).toBeVisible();
  await page.keyboard.press("Alt+Backspace");
  await expect(deleteTabPopup(page)).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep the first note");
});
