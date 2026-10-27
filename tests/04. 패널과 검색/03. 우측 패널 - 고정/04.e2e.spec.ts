import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { workspaceBounds } from "../__util__";

test("4. 모바일 크기에서는 오버레이를 사용하고 PC 크기로 돌아오면 다시 고정한다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect
    .poll(async () => (await workspaceBounds(page)).width)
    .toBe(MOBILE_VIEWPORT.width);
  await expect(page.locator(".dashboard .side-panel-backdrop")).toBeVisible();
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect
    .poll(async () => (await workspaceBounds(page)).width)
    .toBeLessThan(DESKTOP_VIEWPORT.width);
  await expect(page.locator(".dashboard .side-panel-backdrop")).toBeHidden();
});
