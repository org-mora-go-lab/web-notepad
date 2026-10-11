import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { seedStoredStateOnLoad } from "../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("1. 하단 왼쪽의 전체 검색 명령으로 패널을 열고 빈 상태를 표시한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  const command = page.locator(".global-search-command");
  const searchBounds = (await command.boundingBox())!;
  const bookmarkBounds = (await page.locator(".bookmark-command").boundingBox())!;
  expect(searchBounds.x + searchBounds.width).toBeLessThanOrEqual(bookmarkBounds.x);
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(command.locator(".global-search-label")).toHaveText("SEARCH");
  await expect(command.locator(".global-search-label")).toBeVisible();
  await expect(command.locator("svg")).toBeVisible();
  const iconBounds = (await command.locator("svg").boundingBox())!;
  const labelBounds = (await command.locator(".global-search-label").boundingBox())!;
  expect(iconBounds.y + iconBounds.height).toBeLessThanOrEqual(labelBounds.y);
  await command.press("Enter");
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator(".global-search-empty-state")).toHaveText("Enter a search term");
  await page.getByRole("searchbox", { name: "전체 검색" }).fill("No matching term");
  await expect(page.locator(".global-search-empty-state")).toHaveText("No search results");
});