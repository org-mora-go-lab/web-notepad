import { test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { expectCssPx, openSettingsPanel } from "../../__util__";

test("8. 모바일 패널 헤더의 닫기 버튼은 33.6px, 아이콘은 14.4px로 표시한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await openSettingsPanel(page);
  const close = page.locator("#settings-panel .side-panel-close");
  await expectCssPx(close, "width", 33.6);
  await expectCssPx(close, "height", 33.6);
  await expectCssPx(close.locator("svg"), "width", 14.4);
});
