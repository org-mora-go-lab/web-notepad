import { expect, test } from "@playwright/test";

import { openBookmarksPanel } from "../../__util__";

test("3. Escape로 북마크를 닫으면 더보기 버튼으로 포커스를 돌린다", async ({ page }) => {
  await page.goto("/"); await openBookmarksPanel(page); await page.keyboard.press("Escape");
  await expect(page.locator("#bookmarks-panel")).toBeHidden();
  await expect(page.locator(".footer .more-command")).toBeFocused();
});
