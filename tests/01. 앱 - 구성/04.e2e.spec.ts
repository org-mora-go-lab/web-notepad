import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { bookmarksCommand } from "../__util__";

test("4. 모바일 1.2배 확대에서 하단부·편집기·라인 번호는 제외해 기존 아이콘·글자 크기를 유지한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  await expect(bookmarksCommand(page).locator(".status-label")).toHaveCSS("font-size", "12px");
  await expect(bookmarksCommand(page).locator("svg")).toHaveCSS("width", "24px");
  await expect(page.locator(".group-status-name")).toHaveCSS("font-size", "15px");
  await expect(page.locator(".footer")).toHaveCSS("min-height", "64px");

  const editor = page.locator(".note-area");
  await expect(editor).toHaveCSS("font-size", "19px");
  await expect(editor).toHaveCSS("line-height", "39px");
  await expect(page.locator(".line-rail")).toHaveCSS("font-size", "12px");
});
