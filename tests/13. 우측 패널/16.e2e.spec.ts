import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";
import { groupSelectCommand, openPanel } from "../__util__";
import { panelPinButton, workspaceBounds } from "./__util__";

test("16. 패널을 고정하면 우측에 배치되고 body와 MENU·그룹 선택 버튼이 패널 왼쪽으로 이동한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  const panel = page.locator("#bookmarks-panel");
  await panelPinButton(page, "bookmarks-panel").click();
  await expect(panelPinButton(page, "bookmarks-panel")).toHaveAttribute("aria-pressed", "true");
  await expect(panelPinButton(page, "bookmarks-panel")).toHaveAttribute("aria-label", "패널 고정 해제");

  await expect(panel).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  const panelBounds = (await panel.boundingBox())!;
  expect(panelBounds.x + panelBounds.width).toBeCloseTo(DESKTOP_VIEWPORT.width, 0);
  await expect.poll(async () => (await workspaceBounds(page)).width).toBeCloseTo(panelBounds.x, 0);

  const menuBounds = (await page.getByRole("button", { name: "MENU", exact: true }).boundingBox())!;
  const groupBounds = (await groupSelectCommand(page).boundingBox())!;
  expect(menuBounds.x + menuBounds.width).toBeLessThanOrEqual(panelBounds.x + 0.5);
  expect(groupBounds.x + groupBounds.width).toBeLessThanOrEqual(panelBounds.x + 0.5);

});
