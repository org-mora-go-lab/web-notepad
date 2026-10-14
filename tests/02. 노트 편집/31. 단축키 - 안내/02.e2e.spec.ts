import { expect, test } from "@playwright/test";

import { openShortcutsPanel } from "../../__util__";

test("2. SHORTCUT 패널에 Shift+클릭 줄 범위 선택·해제를 안내한다", async ({ page }) => {
  await page.goto("/");
  await openShortcutsPanel(page);
  const row = page.locator("#shortcuts-panel .shortcut-row").filter({
    hasText: "Select or clear a line range",
  });
  await expect(row.locator("dt")).toHaveText("Select or clear a line range");
  await expect(row.locator("kbd")).toHaveText("Shift + Click");
});
