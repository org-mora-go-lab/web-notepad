import { expect, test } from "@playwright/test";

import { openShortcutsPanel } from "../../__util__";

test("4. Shortcut 안내의 단축키 설명은 15px로 표시한다", async ({ page }) => {
  await page.goto("/");
  await openShortcutsPanel(page);
  await expect(page.locator("#shortcuts-panel .shortcut-row dt").first()).toHaveCSS(
    "font-size",
    "15px",
  );
});
