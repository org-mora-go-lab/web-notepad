import { expect, test } from "@playwright/test";

import { bookmarkActiveTab, bookmarksCommand } from "../../__util__";

test("6. PC 북마크 패널의 제목·항목·검색·시각·동작 글자 크기를 표시한다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "note line 1\nnote line 2");
  await bookmarksCommand(page).click();

  const panel = page.locator("#bookmarks-panel");
  const search = page.getByRole("searchbox", { name: "Search bookmarks" });
  const item = page.locator(".bookmark-item");
  await expect(panel.locator("h2")).toHaveCSS("font-size", "22px");
  await expect(search).toHaveCSS("font-size", "14px");
  await expect(search.locator("xpath=..")).toHaveCSS("height", "42px");
  await expect(item.locator(".bookmark-item-heading strong")).toHaveCSS("font-size", "15px");
  await expect(item.locator("time")).toHaveCSS("font-size", "12px");
  await expect(item.locator(".bookmark-item-content")).toHaveCSS("font-size", "16px");
  await expect(item.locator(".bookmark-actions button").first()).toHaveCSS("font-size", "13px");

  await search.fill("missing");
  await expect(panel.locator(".search-empty-state p")).toHaveCSS("font-size", "15px");
  await search.fill("");
  await item.getByRole("button", { name: "Remove bookmark note line 1" }).click();
  await expect(panel.locator(".bookmark-empty p")).toHaveCSS("font-size", "16px");
});
