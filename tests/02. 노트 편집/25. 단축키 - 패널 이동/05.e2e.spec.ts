import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("5. 이미 왼쪽 열에 있는 탭에는 Option+F11을 적용하지 않는다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("left note");
  await addTabButton(page).click();
  await editor.fill("right note");
  await editor.press("Alt+F12");

  const leftEditor = page.locator('[data-pane="left"] textarea');
  await leftEditor.focus();
  await leftEditor.press("Alt+F11");

  await expect(page.locator(".pane-slot")).toHaveCount(2);
  await expect(leftEditor).toHaveValue("left note");
  await expect(leftEditor).toBeFocused();
});
