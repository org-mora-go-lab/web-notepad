import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";
import { openPanel } from "../__util__";
import { dragPanelEdgeTo } from "./__util__";

test("13. 조절한 패널 너비는 모든 우측 패널에 공통 적용·새로고침 후 유지하며 고정 시 body가 조절한 너비만큼 왼쪽으로 이동한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await expect(page.locator("#dashboard-panel")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await dragPanelEdgeTo(page, "dashboard-panel", DESKTOP_VIEWPORT.width - 560);
  const widthOf = async (panelId: string) => (await page.locator(`#${panelId}`).boundingBox())!.width;
  await expect.poll(() => widthOf("dashboard-panel")).toBeCloseTo(560, 0);
  await page.keyboard.press("Escape");

  await page.reload();
  await openPanel(page, "bookmarks-panel");
  await expect(page.locator("#bookmarks-panel")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await expect.poll(() => widthOf("bookmarks-panel")).toBeCloseTo(560, 0);

  await page.locator("#bookmarks-panel .side-panel-pin").click();
  await expect.poll(async () => (await page.locator(".workspace").boundingBox())!.width)
    .toBeCloseTo(DESKTOP_VIEWPORT.width - 560, 0);
  await dragPanelEdgeTo(page, "bookmarks-panel", DESKTOP_VIEWPORT.width - 500);
  await expect.poll(async () => (await page.locator(".workspace").boundingBox())!.width)
    .toBeCloseTo(DESKTOP_VIEWPORT.width - 500, 0);
});
