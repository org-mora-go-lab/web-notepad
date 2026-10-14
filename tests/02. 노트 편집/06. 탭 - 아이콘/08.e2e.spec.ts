import { test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { expectCssPx } from "../../__util__";

test("8. PC 탭 색상 아이콘은 11px, 버튼 영역은 14px이다", async ({
  page,
}) => {
  await page.goto("/");
  const colorButton = page.locator(".tab-item.is-active .dirty-dot");
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expectCssPx(colorButton, "width", 14);
  await expectCssPx(colorButton, "height", 14);
  await expectCssPx(colorButton, "width", 11, "::before");
  await expectCssPx(colorButton, "height", 11, "::before");
});
