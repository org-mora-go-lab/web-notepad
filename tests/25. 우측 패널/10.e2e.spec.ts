import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { RIGHT_PANEL_VIEWPORTS } from "./__constant__";

test("10. 닫힌 우측 패널은 그림자를 남기지 않고 열린 패널만 그림자를 표시한다", async ({ page }) => {
  await page.goto("/");
  const panels = page.locator(".side-panel-drawer");
  await expect(panels).toHaveCount(6);

  for (const { viewport, panelIds } of RIGHT_PANEL_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const panel of await panels.all()) {
      await expect(panel).toHaveAttribute("aria-hidden", "true");
      await expect(panel).toHaveCSS("box-shadow", "none");
    }

    for (const panelId of [...panelIds, "global-search-panel"]) {
      const panel = page.locator(`#${panelId}`);
      await openPanel(page, panelId);
      await expect(panel).toHaveAttribute("aria-hidden", "false");
      await expect(panel).not.toHaveCSS("box-shadow", "none");
      for (const closedPanel of await page.locator('.side-panel-drawer[aria-hidden="true"]').all()) {
        await expect(closedPanel).toHaveCSS("box-shadow", "none");
      }
      await page.keyboard.press("Escape");
      await expect(panel).toHaveAttribute("aria-hidden", "true");
      await expect(panel).toHaveCSS("box-shadow", "none");
    }
  }
});