import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { bookmarkActiveTab, bookmarksCommand } from "../../__util__";

test("7. 모바일 북마크 패널 글자를 PC의 1.2배로 표시하고 검색 높이는 유지한다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "note line 1\nnote line 2");
  await page.setViewportSize(MOBILE_VIEWPORT);
  await bookmarksCommand(page).click();

  const panel = page.locator("#bookmarks-panel");
  const search = page.getByRole("searchbox", { name: "Search bookmarks" });
  const item = page.locator(".bookmark-item");
  await expect(panel.locator("h2")).toHaveCSS("font-size", "26.4px");
  await expect(search).toHaveCSS("font-size", "16.8px");
  await expect(search.locator("xpath=..")).toHaveCSS("height", "42px");
  await expect(item.locator(".bookmark-item-heading strong")).toHaveCSS("font-size", "18px");
  await expect(item.locator("time")).toHaveCSS("font-size", "14.4px");
  await expect(item.locator(".bookmark-item-content")).toHaveCSS("font-size", "19.2px");
  await expect(item.locator(".bookmark-actions button").first()).toHaveCSS("font-size", "15.6px");

  await search.fill("missing");
  await expect(panel.locator(".search-empty-state p")).toHaveCSS("font-size", "18px");
  await search.fill("");
  await item.getByRole("button", { name: "Remove bookmark note line 1" }).click();
  await expect(panel.locator(".bookmark-empty p")).toHaveCSS("font-size", "19.2px");
});
