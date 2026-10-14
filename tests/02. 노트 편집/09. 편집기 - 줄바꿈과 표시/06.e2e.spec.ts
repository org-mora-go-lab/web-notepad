import { expect, test } from "@playwright/test";

import { lineButtons } from "../../__util__";
import { getEditorFormat } from "./__util__";

test("6. PC 편집기 글자 크기는 19px, 줄 높이는 35px이며 줄 번호 영역 너비는 39px이다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const lines = lineButtons(page);
  await editor.fill("First line\nSecond line");
  await expect(lines).toHaveCount(2);

  await expect(editor).toHaveCSS("font-size", "19px");
  await expect(editor).toHaveCSS("line-height", "35px");
  const desktopFormat = await getEditorFormat(page);
  expect(desktopFormat.lineHeight).toBe("35px");
  expect(desktopFormat.lineRailWidth).toBe(39);
});
