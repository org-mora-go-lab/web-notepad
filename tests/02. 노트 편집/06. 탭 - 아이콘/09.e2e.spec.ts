import { test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { expectCssPx } from "../../__util__";

test("9. 모바일 탭 색상 아이콘은 15.6px, 버튼 영역은 16.8px이다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const colorButton = page.locator(".tab-item.is-active .dirty-dot");

  await expectCssPx(colorButton, "width", 16.8);
  await expectCssPx(colorButton, "height", 16.8);
  await expectCssPx(colorButton, "width", 15.6, "::before");
  await expectCssPx(colorButton, "height", 15.6, "::before");
});
