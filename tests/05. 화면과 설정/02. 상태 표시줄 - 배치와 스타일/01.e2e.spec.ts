import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("1. 하단 메뉴는 그룹·BOOKMARK·DASHBOARD만 표시하고 저장 상태 아이콘을 표시하지 않는다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".status-light, .save-state")).toHaveCount(0);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const commands = page.locator(".status-meta .status-command:visible");
    await expect(commands).toHaveCount(3);
    await expect(page.locator(".status-meta .group-select-command:visible")).toHaveCount(1);
    await expect(page.locator(".status-meta .bookmark-command:visible")).toHaveCount(1);
    await expect(page.locator(".status-meta .dashboard-command:visible")).toHaveCount(1);
  }
});
