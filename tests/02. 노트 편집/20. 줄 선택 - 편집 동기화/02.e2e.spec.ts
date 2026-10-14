import { test } from "@playwright/test";

import { expectSelectedLines, lineButtons } from "../../__util__";

test("2. 선택한 줄을 삭제하면 해당 선택을 제거하고 남은 선택 위치를 맞춘다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const lines = lineButtons(page);
  await editor.fill("zero\none\ntwo\nthree");
  await lines.nth(2).click();
  await lines.nth(3).click();

  await editor.fill("zero\none\nthree");
  await expectSelectedLines(page, [false, false, true]);
});
