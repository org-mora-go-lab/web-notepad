import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";
import { groupSelectCommand, openPanel } from "../__util__";
import { closePanelWithX, panelPinButton, workspaceBounds } from "./__util__";

test("2. 패널을 고정하면 패널은 슬라이드 효과 없이 우측에 고정되고 body와 MENU·그룹 선택 버튼이 패널 왼쪽으로 이동한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  const panel = page.locator("#bookmarks-panel");
  await panelPinButton(page, "bookmarks-panel").click();
  await expect(panelPinButton(page, "bookmarks-panel")).toHaveAttribute("aria-pressed", "true");
  await expect(panelPinButton(page, "bookmarks-panel")).toHaveAttribute("aria-label", "패널 고정 해제");

  await expect(panel).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await expect(panel).toHaveCSS("transition-duration", "0s");
  const panelBounds = (await panel.boundingBox())!;
  expect(panelBounds.x + panelBounds.width).toBeCloseTo(DESKTOP_VIEWPORT.width, 0);
  await expect.poll(async () => (await workspaceBounds(page)).width).toBeCloseTo(panelBounds.x, 0);

  const menuBounds = (await page.getByRole("button", { name: "MENU", exact: true }).boundingBox())!;
  const groupBounds = (await groupSelectCommand(page).boundingBox())!;
  expect(menuBounds.x + menuBounds.width).toBeLessThanOrEqual(panelBounds.x + 0.5);
  expect(groupBounds.x + groupBounds.width).toBeLessThanOrEqual(panelBounds.x + 0.5);

  // The workspace stays usable: no backdrop covers it while the panel is pinned.
  await expect(page.locator(".bookmark .side-panel-backdrop")).toBeHidden();
  await page.locator(".note-area").click();
  await page.keyboard.type("typed while pinned");
  await expect(page.locator(".note-area")).toHaveValue("typed while pinned");
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  // Closing and reopening a pinned panel happens in place, without sliding.
  await closePanelWithX(page, "bookmarks-panel");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(panel).toHaveCSS("transition-duration", "0s");
  await openPanel(page, "bookmarks-panel");
  // Measured right after opening: without a slide the drawer is already in place.
  const offsetRight = await panel.evaluate((element) => window.innerWidth - element.getBoundingClientRect().right);
  expect(offsetRight).toBeCloseTo(0, 0);
});
