import { expect, test } from "@playwright/test";

import { deleteTabPopup } from "../../__util__";

test("10. 탭 닫기 팝업은 Cancel에 기본 포커스를 둔다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("Do not delete this note");
  await editor.press("Alt+Backspace");

  const popup = deleteTabPopup(page);
  await expect(popup).toBeVisible();
  await expect(popup.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
});
