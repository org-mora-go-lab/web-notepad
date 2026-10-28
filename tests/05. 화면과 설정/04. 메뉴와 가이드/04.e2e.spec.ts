import { expect, test } from "@playwright/test";

import { openHeaderMenu } from "../../__util__";

test("4. 하단 더보기는 GUIDE·SEARCH·Bookmark·SETTINGS를 순서대로 표시하고 Tab으로 탐색한다", async ({
  page,
}) => {
  await page.goto("/");
  const tools = await openHeaderMenu(page);
  const buttons = tools.getByRole("button");
  await expect(buttons).toHaveText([
    "All Group",
    "Ungrouped",
    "GUIDE",
    "SEARCH",
    "Bookmark",
    "SETTINGS",
  ]);
  await buttons.first().focus();
  for (let index = 1; index < 6; index += 1) {
    await page.keyboard.press("Tab");
    await expect(buttons.nth(index)).toBeFocused();
  }
});
