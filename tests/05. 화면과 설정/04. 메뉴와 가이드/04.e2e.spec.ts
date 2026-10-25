import { expect, test } from "@playwright/test";

import { openHeaderMenu } from "../../__util__";

test("4. 하단 더보기는 GUIDE·SETTINGS·SEARCH·Bookmark를 순서대로 표시하고 Tab으로 탐색한다", async ({ page }) => {
  await page.goto("/");
  const tools = await openHeaderMenu(page);
  const buttons = tools.getByRole("button");
  await expect(buttons).toHaveText(["GUIDE", "SETTINGS", "SEARCH", "Bookmark", "BOARD"]);
  await buttons.first().focus();
  await page.keyboard.press("Tab");
  await expect(buttons.nth(1)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(buttons.nth(2)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(buttons.nth(3)).toBeFocused();
});
