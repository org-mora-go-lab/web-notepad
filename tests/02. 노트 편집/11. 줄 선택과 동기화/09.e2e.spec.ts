import { test } from "@playwright/test";

import { addTabButton, expectSelectedLines, lineButtons } from "../../__util__";

test("9. 탭을 분할 패널로 이동해도 줄 선택을 유지한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("one\ntwo\nthree");
  await lineButtons(page).nth(1).click();
  await lineButtons(page).nth(2).click();
  await addTabButton(page).click();
  await page.getByRole("tab").first().click();
  await page.locator("textarea").press("Alt+F12");
  await expectSelectedLines(page.locator('.pane-slot[data-pane="right"]'), [
    false,
    true,
    true,
  ]);
});
