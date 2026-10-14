import { test } from "@playwright/test";

import { addTabButton, expectSelectedLines, lineButtons } from "../../__util__";

test("3. 분할 패널로 이동한 탭의 줄 선택을 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("one\ntwo\nthree");
  await lineButtons(page).nth(1).click();
  await lineButtons(page).nth(2).click();
  await addTabButton(page).click();
  await page.getByRole("tab").first().click();
  await page.locator("textarea").press("Alt+F12");

  await page.reload();
  await expectSelectedLines(page.locator('.pane-slot[data-pane="right"]'), [
    false,
    true,
    true,
  ]);
});
