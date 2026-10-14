import { test } from "@playwright/test";

import { expectSelectedLines, lineButtons } from "../../__util__";

test("3. 편집으로 이동한 줄 선택 위치를 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const lines = lineButtons(page);
  await editor.fill("one\ntwo\nthree");
  await lines.nth(1).click();
  await lines.nth(2).click();
  await editor.fill("zero\none\ntwo\nthree");
  await editor.fill("zero\none\nthree");
  await expectSelectedLines(page, [false, false, true]);

  await page.reload();
  await expectSelectedLines(page, [false, false, true]);
});
