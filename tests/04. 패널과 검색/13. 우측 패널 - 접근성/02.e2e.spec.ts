import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";

test("2. 하단 패널 버튼은 X로 닫은 뒤에도 Tab 탐색에서 포커스를 표시한다", async ({ page }) => {
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  const toggle = page.locator('button[aria-controls="dashboard-panel"]:visible');
  await page.locator("#dashboard-panel .side-panel-close").click();
  await page.locator('button[aria-controls="bookmarks-panel"]:visible').focus();
  await page.keyboard.press("Tab");

  await expect(toggle).toBeFocused();
  await expect(toggle).not.toHaveCSS("outline-style", "none");
});
