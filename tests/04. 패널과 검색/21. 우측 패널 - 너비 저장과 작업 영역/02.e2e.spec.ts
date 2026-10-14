import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dragPanelEdgeTo } from "../__util__";

test("2. 조절한 패널 너비는 새로고침 후에도 유지한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await dragPanelEdgeTo(page, "dashboard-panel", DESKTOP_VIEWPORT.width - 560);
  await page.reload();

  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");
  await expect.poll(async () => (await page.locator("#dashboard-panel").boundingBox())!.width).toBeCloseTo(560, 0);
});
