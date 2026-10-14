import { expect, test } from "@playwright/test";

import { chooseTabMenuItem } from "../../__util__";

test("2. PC 우클릭 메뉴에서 탭의 북마크 상태를 전환한다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Bookmark");
  await expect(tab).toHaveClass(/is-bookmarked/);
  await chooseTabMenuItem(page, "Remove bookmark");
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});
