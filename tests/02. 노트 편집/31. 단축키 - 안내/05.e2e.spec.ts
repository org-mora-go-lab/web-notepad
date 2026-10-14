import { expect, test } from "@playwright/test";

import { openShortcutsPanel } from "../../__util__";

test("5. Shortcut 안내의 키 표시는 12px로 표시한다", async ({ page }) => {
  await page.goto("/");
  await openShortcutsPanel(page);
  await expect(page.locator("#shortcuts-panel .shortcut-row kbd").first()).toHaveCSS(
    "font-size",
    "12px",
  );
});
