import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { panelPinButton, workspaceBounds } from "../__util__";

test("6. 저장된 고정 상태가 있어도 모바일에서는 전체 너비 오버레이 패널로 표시한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  await panelPinButton(page, "bookmarks-panel").click();
  await page.setViewportSize(MOBILE_VIEWPORT);

  await expect.poll(async () => (await workspaceBounds(page)).width).toBe(MOBILE_VIEWPORT.width);
  await expect(page.locator(".bookmark .side-panel-backdrop")).toBeVisible();
  await expect(page.locator("#bookmarks-panel").getByRole("button", { name: /pin panel/i })).toHaveCount(0);
});
