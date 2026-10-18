import { expect, test } from "@playwright/test";

import { openBookmarksPanel } from "../../__util__";

test("10. 모바일 패널을 닫은 뒤 편집기를 다시 포커스할 수 있다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await openBookmarksPanel(page);
  await page.getByRole("button", { name: "Close Bookmarks" }).click();
  await page.locator("textarea").focus();
  await expect(page.locator("textarea")).toBeFocused();
});
