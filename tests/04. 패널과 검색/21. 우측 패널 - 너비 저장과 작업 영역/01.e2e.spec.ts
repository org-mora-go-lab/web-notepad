import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { RIGHT_PANEL_IDS } from "../__constant__";
import { dragPanelEdgeTo } from "../__util__";

test("1. 조절한 너비는 모든 우측 패널에 공통으로 적용한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await dragPanelEdgeTo(page, "dashboard-panel", DESKTOP_VIEWPORT.width - 560);
  await expect.poll(async () => (await page.locator("#dashboard-panel").boundingBox())!.width).toBeCloseTo(560, 0);
  await page.keyboard.press("Escape");

  for (const panelId of RIGHT_PANEL_IDS) {
    await openPanel(page, panelId);
    await expect
      .poll(async () => (await page.locator(`#${panelId}`).boundingBox())!.width)
      .toBeCloseTo(560, 0);
    await page.keyboard.press("Escape");
  }
});
