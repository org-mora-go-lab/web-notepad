import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { lineButtons } from "../../__util__";
import { getEditorFormat } from "./__util__";

test("4. 모바일 편집기 글자 크기는 19px, 줄 높이는 39px이며 줄 번호 영역 너비는 41px이다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const lines = lineButtons(page);
  await editor.fill("First line\nSecond line");
  await expect(lines).toHaveCount(2);
  const desktopFormat = await getEditorFormat(page);

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(editor).toHaveCSS("font-size", "19px");
  await expect(editor).toHaveCSS("line-height", "39px");
  const mobileFormat = await getEditorFormat(page);
  expect(mobileFormat.lineHeight).toBe("39px");
  expect(mobileFormat.topPadding).toBe(desktopFormat.topPadding);
  expect(mobileFormat.lineRailWidth).toBe(41);
  expect(mobileFormat.lineNumberPadding).toBe(desktopFormat.lineNumberPadding);
  expect(mobileFormat.editorPadding).toBe(desktopFormat.editorPadding);
});
