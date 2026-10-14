import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dragPanelEdgeTo } from "../__util__";

test("7. 화면 크기가 바뀌면 저장된 패널 너비를 현재 화면 너비의 70% 이하로 제한한다", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: DESKTOP_VIEWPORT.height });
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  const panel = page.locator("#bookmarks-panel");
  const width = async () => (await panel.boundingBox())!.width;
  await dragPanelEdgeTo(page, "bookmarks-panel", 500);
  await expect.poll(width).toBeCloseTo(1920 * 0.7, 0);

  await page.setViewportSize({ width: 641, height: DESKTOP_VIEWPORT.height });
  await expect.poll(width).toBeCloseTo(641 * 0.7, 1);
});
