import { test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { expectCssPx, openPanel, openSettingsPanel } from "../../__util__";

test("7. PC 패널 헤더의 초기화·고정·닫기 버튼과 아이콘을 1.2배 크기로 표시한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = page.locator("#settings-panel");
  for (const button of ["side-panel-action", "side-panel-pin", "side-panel-close"]) {
    await expectCssPx(panel.locator(`.${button}`), "width", 33.6);
    await expectCssPx(panel.locator(`.${button}`), "height", 33.6);
  }
  await expectCssPx(panel.locator(".side-panel-action svg"), "width", 14.4);
  await expectCssPx(panel.locator(".side-panel-pin svg"), "width", 16.8);
  await expectCssPx(panel.locator(".side-panel-close svg"), "width", 14.4);
  await page.keyboard.press("Escape");
  await openPanel(page, "shortcuts-panel");
  await expectCssPx(page.locator("#shortcuts-panel .side-panel-close svg"), "width", 19.2);
});
