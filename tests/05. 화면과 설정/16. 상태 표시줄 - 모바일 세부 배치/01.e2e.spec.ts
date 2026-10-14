import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test("1. 모바일 BOOKMARK·DASHBOARD 라벨은 아이콘 아래에 지정된 크기와 간격으로 표시한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  const bookmark = page.locator(".bookmark-command");
  const dashboard = page.locator(".dashboard-command");
  for (const command of [bookmark, dashboard]) {
    await expect(command).toHaveCSS("flex-direction", "column");
    await expect(command).toHaveCSS("gap", "4px");
    await expect(command.locator(".status-label")).toHaveCSS("font-size", "10px");
    await expect(command.locator(".status-label")).toHaveCSS("text-transform", "uppercase");
  }
  await expect(bookmark).toHaveCSS("margin-right", "16px");
});
