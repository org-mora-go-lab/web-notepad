import { expect, test } from "@playwright/test";

import { openShortcutsPanel } from "../__util__";

test("8. macOS Shortcut 안내에서 Alt를 Option으로 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  await openShortcutsPanel(page);

  const panel = page.locator("#shortcuts-panel");
  await expect(panel).toContainText("Option + Tab");
  await expect(panel).toContainText("Option + Backspace");
  await expect(panel).toContainText("Option + Arrow Up");
  await expect(panel).toContainText("Option + Arrow Down");
  await expect(panel).toContainText("Option + A");
  await expect(panel).not.toContainText("Alt");
});
