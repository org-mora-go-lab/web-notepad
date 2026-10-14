import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { closePanelWithX, panelPinButton, workspaceBounds } from "../__util__";

test("5. 패널 고정 상태는 새로고침 후에도 유지한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  await panelPinButton(page, "bookmarks-panel").click();
  await closePanelWithX(page, "bookmarks-panel");
  await page.reload();
  await openPanel(page, "bookmarks-panel");

  await expect(panelPinButton(page, "bookmarks-panel")).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => (await workspaceBounds(page)).width).toBeLessThan(DESKTOP_VIEWPORT.width);
});
