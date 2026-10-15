import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { RIGHT_PANEL_VIEWPORTS } from "../__constant__";

test("4. 브라우저 뒤로가기로 열린 우측 패널을 닫는다", async ({ page }) => {
  await page.goto("/");
  for (const { viewport, panelIds } of RIGHT_PANEL_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const panelId of panelIds) {
      const panel = page.locator(`#${panelId}`);
      await openPanel(page, panelId);
      await expect(panel).toHaveAttribute("aria-hidden", "false");
      await page.goBack();
      await expect(panel).toHaveAttribute("aria-hidden", "true");
    }
  }
});
