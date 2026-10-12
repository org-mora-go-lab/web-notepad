import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { seedStoredStateOnLoad } from "../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("2. 모바일 전체 검색 명령은 아이콘 아래에 SEARCH 라벨을 표시한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  const command = page.locator(".global-search-command");
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(command.locator(".global-search-label")).toHaveText("SEARCH");
  await expect(command.locator(".global-search-label")).toBeVisible();
  await expect(command.locator("svg")).toBeVisible();
  const iconBounds = (await command.locator("svg").boundingBox())!;
  const labelBounds = (await command.locator(".global-search-label").boundingBox())!;
  expect(iconBounds.y + iconBounds.height).toBeLessThanOrEqual(labelBounds.y);
});
