import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dragPanelEdgeTo } from "../__util__";

test("2. PC 패널 너비는 최소 336px부터 화면 너비의 최대 80%까지 조절한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  const panel = page.locator("#dashboard-panel");
  const width = async () => (await panel.boundingBox())!.width;

  await dragPanelEdgeTo(page, "dashboard-panel", DESKTOP_VIEWPORT.width - 100);
  await expect.poll(width).toBeCloseTo(336, 0);
  await dragPanelEdgeTo(page, "dashboard-panel", 0);
  await expect.poll(width).toBeCloseTo(DESKTOP_VIEWPORT.width * 0.8, 0);
});
