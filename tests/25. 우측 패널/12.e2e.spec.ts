import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { openPanel } from "../__util__";
import { dragPanelEdgeTo } from "./__util__";

test("12. PC 우측 패널의 왼쪽 경계선을 드래그해 320px~화면 너비-400px 범위에서 너비를 조절하고 모바일에서는 경계선을 숨긴다", async ({ page }) => {
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
  await expect.poll(panelWidth).toBeCloseTo(DESKTOP_VIEWPORT.width - 400, 0);

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(handle).toBeHidden();
  await expect.poll(panelWidth).toBeCloseTo(MOBILE_VIEWPORT.width, 0);
});
