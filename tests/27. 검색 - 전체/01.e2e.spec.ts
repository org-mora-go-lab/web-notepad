import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("1. 상태 표시줄의 전체 검색 명령을 선택하면 우측 검색 패널을 연다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  const command = page.locator(".global-search-command");
  await expect(command).toBeVisible();
  await expect(page.locator(".footer .global-search-command")).toHaveCount(1);
  const searchBounds = (await command.boundingBox())!;
  const bookmarkBounds = (await page.locator(".bookmark-command").boundingBox())!;
  expect(searchBounds.x + searchBounds.width).toBeLessThanOrEqual(bookmarkBounds.x);
  await command.press("Enter");
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "false");
});
