import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test("5. 모바일 탭 타이틀과 편집기는 기존 표시 크기에서 3px 축소하고 줄 번호 크기를 유지한다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  const editor = page.locator(".note-area");
  await expect(editor).toHaveCSS("font-size", "14.1px");
  await expect(page.locator(".tab-title").first()).toHaveCSS(
    "font-size",
    "13.38px",
  );
  await expect(editor).toHaveCSS("line-height", "35px");
  await expect(page.locator(".line-rail")).toHaveCSS("font-size", "10.8px");
});
