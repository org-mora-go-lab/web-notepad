import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("3. 이미 대상 열에 있는 탭에는 같은 방향의 패널 이동 단축키를 적용하지 않는다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("existing note");
  await addTabButton(page).click();
  await page.locator("textarea").fill("moving note");
  await page.locator("textarea").press("Alt+F12");
  const rightEditor = page.locator('[data-pane="right"] textarea');
  await expect(rightEditor).toHaveValue("moving note");

  await rightEditor.press("Alt+F12");
  await expect(page.locator(".pane-slot")).toHaveCount(2);
  await expect(rightEditor).toHaveValue("moving note");
  await expect(rightEditor).toBeFocused();
});
