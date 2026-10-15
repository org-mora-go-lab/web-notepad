import { expect, test } from "@playwright/test";

import { bookmarksCommand, openPanel } from "../../__util__";

test("1. 하단 SEARCH·BOOKMARK·DASHBOARD 명령으로 각 우측 패널을 연다", async ({ page }) => {
  await page.goto("/");
  await openPanel(page, "global-search-panel");
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "Close Search" }).click();

  await bookmarksCommand(page).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "Close Bookmarks" }).click();

  await openPanel(page, "dashboard-panel");
  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");
});
