import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { bookmarksCommand } from "../__util__";

test("1. PC와 모바일에서 BOOKMARK 아이콘과 라벨을 표시한다", async ({ page }) => {
  await page.goto("/");
  const label = bookmarksCommand(page).locator(".status-label");
  const icon = bookmarksCommand(page).locator("svg");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(label).toHaveText("BOOKMARK");
  await expect(label).toBeInViewport();
  await expect(icon).toBeInViewport();

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(label).toBeVisible();
  await expect(icon).toBeInViewport();
});
