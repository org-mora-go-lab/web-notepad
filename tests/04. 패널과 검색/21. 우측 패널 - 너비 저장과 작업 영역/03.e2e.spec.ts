import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dragPanelEdgeTo, panelPinButton, workspaceBounds } from "../__util__";

test("3. 고정 패널의 작업 영역은 조절한 패널 너비를 제외한 공간을 사용한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  await dragPanelEdgeTo(page, "bookmarks-panel", DESKTOP_VIEWPORT.width - 500);
  await panelPinButton(page, "bookmarks-panel").click();

  await expect.poll(async () => (await workspaceBounds(page)).width).toBeCloseTo(DESKTOP_VIEWPORT.width - 500, 0);
  for (const selector of [".header", ".note-area", ".footer"]) {
    await expect.poll(async () => (await page.locator(selector).boundingBox())!.width).toBeLessThanOrEqual(DESKTOP_VIEWPORT.width - 500);
  }
});
