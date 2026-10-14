import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { getEditorFormat } from "./__util__";

test("10. PC와 모바일 편집기는 동일한 상단·편집기·줄 번호 여백을 유지한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("First line\nSecond line");
  const desktop = await getEditorFormat(page);
  expect(desktop.topPadding).toBe("10px");
  expect(desktop.editorPadding).toBe("10px 22px");
  expect(desktop.lineNumberPadding).toBe("10px");

  await page.setViewportSize(MOBILE_VIEWPORT);
  const mobile = await getEditorFormat(page);
  expect(mobile.topPadding).toBe(desktop.topPadding);
  expect(mobile.editorPadding).toBe(desktop.editorPadding);
  expect(mobile.lineNumberPadding).toBe(desktop.lineNumberPadding);
});
