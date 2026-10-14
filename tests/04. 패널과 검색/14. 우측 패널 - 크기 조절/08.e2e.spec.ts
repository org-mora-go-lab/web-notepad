import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";

test("8. 모바일 패널은 크기 조절 경계선을 숨기고 화면 전체 너비를 유지한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  const panel = page.locator("#bookmarks-panel");

  await expect(panel.locator(".side-panel-resizer")).toBeHidden();
  await expect.poll(async () => (await panel.boundingBox())!.width).toBeCloseTo(MOBILE_VIEWPORT.width, 0);
});
