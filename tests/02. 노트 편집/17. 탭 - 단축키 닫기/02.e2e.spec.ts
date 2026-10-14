import { expect, test } from "@playwright/test";

import { deleteTabPopup } from "../../__util__";

test("2. Alt/Option+Backspace는 내용이 있는 활성 탭의 확인 팝업을 연다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("Shortcut close confirmation");

  await page.keyboard.press("Alt+Backspace");
  await expect(deleteTabPopup(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(deleteTabPopup(page)).toHaveCount(0);
  await expect(editor).toHaveValue("Shortcut close confirmation");
});
