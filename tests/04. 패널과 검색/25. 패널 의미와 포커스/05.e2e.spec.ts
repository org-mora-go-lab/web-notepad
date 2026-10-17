import { expect, test } from "@playwright/test";

import { openShortcutsPanel } from "../../__util__";

test("5. 단축키 패널은 Shortcut 이름의 complementary 랜드마크다", async ({ page }) => {
  await page.goto("/");
  await openShortcutsPanel(page);
  await expect(page.getByRole("complementary", { name: /Shortcut/ })).toBeVisible();
});
