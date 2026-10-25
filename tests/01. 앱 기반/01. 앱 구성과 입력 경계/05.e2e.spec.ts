import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test("5. 모바일 편집기는 17.1px·35.1px 줄 높이, 라인 번호는 10.8px 글자를 유지한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  const editor = page.locator(".note-area");
  await expect(editor).toHaveCSS("font-size", "17.1px");
  await expect(editor).toHaveCSS("line-height", "35.1px");
  await expect(page.locator(".line-rail")).toHaveCSS("font-size", "10.8px");
});
