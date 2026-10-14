import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { panelPinButton } from "./__util__";

test("15. PC 우측 패널 헤더의 닫기 버튼 왼쪽에 고정 버튼을 표시하고 모바일에서는 숨긴다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  for (const panelId of ["bookmarks-panel", "dashboard-panel", "global-search-panel", "closed-panel", "shortcuts-panel"]) {
    await openPanel(page, panelId);
    await expect(page.locator(`#${panelId}`)).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    const pin = panelPinButton(page, panelId);
    await expect(pin).toBeVisible();
    await expect(pin).toHaveAttribute("aria-label", "패널 고정");
    await expect(pin).toHaveAttribute("aria-pressed", "false");
    const pinBounds = (await pin.boundingBox())!;
    const closeBounds = (await page.locator(`#${panelId} .side-panel-close`).boundingBox())!;
    expect(pinBounds.x + pinBounds.width).toBeLessThanOrEqual(closeBounds.x);
    await page.keyboard.press("Escape");
  }

  await page.setViewportSize(MOBILE_VIEWPORT);
  await openPanel(page, "bookmarks-panel");
  await expect(panelPinButton(page, "bookmarks-panel")).toBeHidden();
});
