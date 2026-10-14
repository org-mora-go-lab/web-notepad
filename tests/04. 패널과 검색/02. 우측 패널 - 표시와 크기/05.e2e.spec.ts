import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dragPanelEdgeTo } from "../__util__";

test("5. PC 패널 너비는 최소 320px부터 화면의 70%까지 조절하고 모바일에서는 경계선을 숨긴다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  const panel = page.locator("#bookmarks-panel");
  await expect(panel).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");

  const handle = panel.locator(".side-panel-resizer");
  await expect(handle).toHaveAttribute("role", "separator");
  await expect(handle).toHaveCSS("cursor", "col-resize");
  await expect(handle).toHaveCSS("width", "10px");
  expect(await handle.evaluate((element) => getComputedStyle(element, "::before").width)).toBe("2px");
  const panelWidth = async () => (await panel.boundingBox())!.width;
  expect(await panelWidth()).toBeCloseTo(462, 0);

  await dragPanelEdgeTo(page, "bookmarks-panel", DESKTOP_VIEWPORT.width - 600);
  await expect.poll(panelWidth).toBeCloseTo(600, 0);

  await dragPanelEdgeTo(page, "bookmarks-panel", DESKTOP_VIEWPORT.width - 100);
  await expect.poll(panelWidth).toBeCloseTo(320, 0);

  await dragPanelEdgeTo(page, "bookmarks-panel", 10);
  await expect.poll(panelWidth).toBeCloseTo(DESKTOP_VIEWPORT.width * 0.7, 0);

  for (const width of [641, 1024, 1920]) {
    await page.setViewportSize({ width, height: DESKTOP_VIEWPORT.height });
    await dragPanelEdgeTo(page, "bookmarks-panel", 0);
    await expect.poll(panelWidth).toBe(Math.floor(width * 0.7));
    expect(await panelWidth()).toBeLessThanOrEqual(width * 0.7);
  }
  await page.reload();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect.poll(panelWidth).toBeCloseTo(1920 * 0.7, 0);
  await page.setViewportSize({ width: 641, height: DESKTOP_VIEWPORT.height });
  await expect.poll(panelWidth).toBeCloseTo(641 * 0.7, 1);

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(handle).toBeHidden();
  await expect.poll(panelWidth).toBeCloseTo(MOBILE_VIEWPORT.width, 0);
});
