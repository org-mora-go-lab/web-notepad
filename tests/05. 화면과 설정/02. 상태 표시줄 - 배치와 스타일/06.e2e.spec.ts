import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";

test("6. PC 상태 표시줄의 48px 높이와 비대칭 좌우 패딩을 적용한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  const statusBar = page.locator(".footer");
  await expect(statusBar).toHaveCSS("padding-top", "6px");
  await expect(statusBar).toHaveCSS("padding-right", "26px");
  await expect(statusBar).toHaveCSS("padding-bottom", "6px");
  await expect(statusBar).toHaveCSS("padding-left", "16px");
  expect((await statusBar.boundingBox())!.height).toBeCloseTo(48, 1);
  expect((await statusBar.boundingBox())!.y + 48).toBeCloseTo(DESKTOP_VIEWPORT.height, 1);
});
