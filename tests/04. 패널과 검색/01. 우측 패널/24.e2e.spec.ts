import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { closePanelWithX, panelPinButton } from "./__util__";

test("24. 고정 패널은 열기·닫기·다시 열기를 슬라이드 없이 즉시 처리한다", async ({ page }) => {
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  const panel = page.locator("#bookmarks-panel");
  await panelPinButton(page, "bookmarks-panel").click();
  await expect(panel).toHaveCSS("transition-duration", "0s");
  await expect(panel).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  // Closing and reopening a pinned panel happens in place, without sliding.
  await closePanelWithX(page, "bookmarks-panel");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(panel).toHaveCSS("transition-duration", "0s");
  await openPanel(page, "bookmarks-panel");
  // Measured right after opening: without a slide the drawer is already in place.
  const offsetRight = await panel.evaluate((element) => window.innerWidth - element.getBoundingClientRect().right);
  expect(offsetRight).toBeCloseTo(0, 0);
});
