import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";
import { groupSelectCommand, openPanel } from "../__util__";
import { panelPinButton,workspaceBounds } from "./__util__";

test("16. 패널을 고정하면 우측에 배치되고 헤더·푸터를 포함한 작업 영역이 패널 왼쪽으로 이동한다", async ({ page }) => {
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

  for (const selector of [".header", ".footer"]) {
    const box = (await page.locator(selector).boundingBox())!;
    expect(box.x + box.width).toBeCloseTo(panelBounds.x, 0);
  }
  await expect(groupSelectCommand(page)).toBeInViewport();
});
