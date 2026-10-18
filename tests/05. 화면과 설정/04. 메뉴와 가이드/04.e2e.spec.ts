import { expect, test } from "@playwright/test";

import { openHeaderMenu } from "../../__util__";

test("4. 헤더 메뉴는 GUIDE·SETTINGS·SEARCH를 순서대로 표시하고 Tab으로 탐색한다", async ({ page }) => {
  await page.goto("/");
  const tools = await openHeaderMenu(page);
  const buttons = tools.getByRole("button");
  await expect(buttons).toHaveText(["GUIDE", "SETTINGS", "SEARCH"]);
  await buttons.first().focus();
  await page.keyboard.press("Tab");
  await expect(buttons.nth(1)).toBeFocused();
});
