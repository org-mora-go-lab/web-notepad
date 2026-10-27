import { test } from "@playwright/test";

import { expectSelectedLines, lineButtons } from "../../__util__";

test("6. 줄을 삽입하면 기존 선택 위치를 새 줄 번호에 맞춰 이동한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const lines = lineButtons(page);
  await editor.fill("one\ntwo\nthree");
  await lines.nth(1).click();
  await lines.nth(2).click();
  await editor.fill("zero\none\ntwo\nthree");
  await expectSelectedLines(page, [false, false, true, true]);
});
