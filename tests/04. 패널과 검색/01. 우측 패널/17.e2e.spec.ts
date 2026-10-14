import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { closePanelWithX, panelPinButton,workspaceBounds } from "./__util__";

test("17. 고정한 패널을 X 버튼으로 닫거나 고정을 해제하면 body가 화면 전체 너비로 돌아온다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await panelPinButton(page, "dashboard-panel").click();
  await expect.poll(async () => (await workspaceBounds(page)).width).toBeLessThan(DESKTOP_VIEWPORT.width);

  await closePanelWithX(page, "dashboard-panel");
  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "true");
  await expect.poll(async () => (await workspaceBounds(page)).width).toBe(DESKTOP_VIEWPORT.width);

  // The pin stays on, so the next panel opens docked.
  await openPanel(page, "global-search-panel");
  await expect(panelPinButton(page, "global-search-panel")).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => (await workspaceBounds(page)).width).toBeLessThan(DESKTOP_VIEWPORT.width);

  await panelPinButton(page, "global-search-panel").click();
  await expect(panelPinButton(page, "global-search-panel")).toHaveAttribute("aria-pressed", "false");
  await expect.poll(async () => (await workspaceBounds(page)).width).toBe(DESKTOP_VIEWPORT.width);
  await expect(page.locator(".global-search .side-panel-backdrop")).toHaveClass(/is-visible/);
});
