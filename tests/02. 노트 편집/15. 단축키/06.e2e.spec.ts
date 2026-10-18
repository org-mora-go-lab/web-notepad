import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("6. Option+F11은 활성 탭을 왼쪽 열의 상단 패널로 이동한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("existing note");
  await addTabButton(page).click();
  await page.locator("textarea").fill("moving note");
  await page.locator("textarea").press("Alt+F12");
  const rightEditor = page.locator('[data-pane="right"] textarea');

  await rightEditor.press("Alt+F11");
  const leftEditor = page.locator('[data-pane="left"] textarea');
  await expect(leftEditor).toHaveValue("moving note");
  await expect(leftEditor).toBeFocused();
});
