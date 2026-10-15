import { test } from "@playwright/test";

import { expectSelectedLines, lineButtons } from "../../__util__";

test("5. 줄 선택과 선택 해제 결과를 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const lines = lineButtons(page);
  await editor.fill("one\ntwo\nthree");
  await lines.nth(1).click();
  await lines.nth(2).click();
  await page.reload();
  await expectSelectedLines(page, [false, true, true]);

  await lines.nth(1).click();
  await page.reload();
  await expectSelectedLines(page, [false, false, true]);
});
