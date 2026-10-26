import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { closePanelWithX, workspaceBounds } from "../__util__";

test("5. 이전 고정 해제 저장값이 있어도 새로고침 후 패널은 항상 고정한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await closePanelWithX(page, "dashboard-panel");
  await page.evaluate(() => localStorage.setItem("web-notepad-panel-pinned", "false"));
  await page.reload();
  await openPanel(page, "dashboard-panel");

  await expect.poll(async () => (await workspaceBounds(page)).width).toBeLessThan(DESKTOP_VIEWPORT.width);
});
