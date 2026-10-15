import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openClosedPanel } from "../../__util__";

test("6. Closed 팝업은 760×640px로 중앙에 표시하고 Escape와 배경 클릭으로 닫는다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openClosedPanel(page);

  const popup = page.locator("#closed-popup");
  const bounds = (await popup.boundingBox())!;
  expect(bounds.width).toBeCloseTo(760, 0);
  expect(bounds.height).toBeCloseTo(640, 0);
  expect(bounds.x).toBeCloseTo((DESKTOP_VIEWPORT.width - bounds.width) / 2, 0);
  expect(bounds.y).toBeCloseTo((DESKTOP_VIEWPORT.height - bounds.height) / 2, 0);

  await page.keyboard.press("Escape");
  await expect(popup).not.toHaveAttribute("open", "");

  await openClosedPanel(page);
  await page.mouse.click(4, 4);
  await expect(popup).not.toHaveAttribute("open", "");
});
