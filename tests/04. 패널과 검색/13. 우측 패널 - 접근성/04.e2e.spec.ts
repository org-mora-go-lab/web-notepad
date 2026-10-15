import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";

test("4. MENU 패널 명령은 Escape로 닫은 뒤에도 방향키 탐색에서 포커스를 표시한다", async ({ page }) => {
  await page.goto("/");
  await openPanel(page, "settings-panel");
  const toggle = page.locator('button[aria-controls="settings-panel"]');
  await page.keyboard.press("Escape");
  const menu = page.getByRole("button", { name: "MENU", exact: true });
  await menu.press("Enter");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");

  await expect(toggle).toBeFocused();
  await expect(toggle).not.toHaveCSS("outline-style", "none");
});
