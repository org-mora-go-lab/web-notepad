import { expect, test } from "@playwright/test";

import { openHeaderMenu } from "../../__util__";

test("4. 하단 더보기는 GUIDE·SEARCH·Bookmark·BOARD를 순서대로 표시하고 Tab으로 탐색한다", async ({
  page,
}) => {
  await page.goto("/");
  const tools = await openHeaderMenu(page);
  const buttons = tools.getByRole("button");
  await expect(buttons).toHaveText(["GUIDE", "SEARCH", "Bookmark", "BOARD"]);
  await buttons.first().focus();
  for (let index = 1; index < 4; index += 1) {
    await page.keyboard.press("Tab");
    await expect(buttons.nth(index)).toBeFocused();
  }
});
