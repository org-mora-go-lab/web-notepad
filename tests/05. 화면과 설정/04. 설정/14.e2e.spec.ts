import { test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { expectCssPx, openSettingsPanel } from "../../__util__";
import { settingsPanel } from "./__util__";

test("14. Tab Colors 오른쪽의 초기화·셔플 버튼은 28.8px, 아이콘은 15.6px로 표시한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const buttons = settingsPanel(page).locator(".setting-section-heading .setting-section-reset");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const button of await buttons.all()) {
      await expectCssPx(button, "width", 28.8);
      await expectCssPx(button, "height", 28.8);
      await expectCssPx(button.locator("svg"), "width", 15.6);
      await expectCssPx(button.locator("svg"), "height", 15.6);
    }
  }
});
