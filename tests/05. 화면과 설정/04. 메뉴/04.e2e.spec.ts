import { expect, test } from "@playwright/test";

import { openSidebarTools } from "../../__util__";

test("4. 그룹 사이드바 MENU 항목을 순서대로 표시하고 Tab으로 탐색한다", async ({ page }) => {
  await page.goto("/");
  const tools = await openSidebarTools(page);
  const buttons = tools.getByRole("button");
  await expect(buttons).toHaveText(["SHORTCUT", "SETTINGS", "GUIDE"]);
  await buttons.first().focus();
  await page.keyboard.press("Tab");
  await expect(buttons.nth(1)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(buttons.nth(2)).toBeFocused();
});
