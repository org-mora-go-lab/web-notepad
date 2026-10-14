import { expect, test } from "@playwright/test";

import { deleteTabPopup } from "../../__util__";

test("1. 탭 닫기 팝업은 키보드 포커스를 팝업 안에 유지한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("Do not delete this note");
  await editor.press("Alt+Backspace");
  const popup = deleteTabPopup(page);
  const cancel = popup.getByRole("button", { name: "Cancel", exact: true });
  const focusedInPopup = popup.locator(":focus");

  await expect(cancel).toBeFocused();
  for (let index = 0; index < 4; index += 1) {
    await page.keyboard.press("Tab");
    await expect(focusedInPopup).toHaveCount(1);
  }
  await cancel.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(focusedInPopup).toHaveCount(1);
  await expect(editor).not.toBeFocused();
});
