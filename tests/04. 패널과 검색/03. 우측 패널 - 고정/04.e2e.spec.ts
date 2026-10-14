import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { panelPinButton, workspaceBounds } from "../__util__";

test("4. 패널 고정을 해제하면 작업 영역을 복원하고 오버레이 패널로 전환한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  await panelPinButton(page, "bookmarks-panel").click();
  await panelPinButton(page, "bookmarks-panel").click();

  await expect.poll(async () => (await workspaceBounds(page)).width).toBe(DESKTOP_VIEWPORT.width);
  await expect(page.locator(".bookmark .side-panel-backdrop")).toHaveClass(/is-visible/);
});
