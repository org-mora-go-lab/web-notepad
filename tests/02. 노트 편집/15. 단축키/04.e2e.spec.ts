import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("4. Alt/Option+Backspace는 빈 활성 탭을 확인 없이 닫는다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  const editor = page.locator("textarea");
  await editor.fill("Keep the first note");
  await addTabButton(page).click();

  await page.keyboard.press("Alt+Backspace");
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep the first note");
});
