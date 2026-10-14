import { expect, test } from "@playwright/test";

import { openShortcutsPanel } from "../../__util__";

test("1. SHORTCUT 패널에 실제 키보드 단축키를 표시한다", async ({ page }) => {
  await page.goto("/");
  await openShortcutsPanel(page);
  const rows = page.locator("#shortcuts-panel .shortcut-row:not(:last-child)");
  await expect(rows.locator("dt")).toHaveText([
    "Add a new tab",
    "Close the active tab",
    "Move between tabs",
    "Select all content",
    "Move to the right pane",
    "Move to the left pane",
    "Insert a tab character",
  ]);
  await expect(rows.locator("kbd")).toHaveText([
    "Option + Tab",
    "Option + Backspace",
    "Option + Arrow Up",
    "Option + Arrow Down",
    "Cmd + A",
    "Option + A",
    "Option + F12",
    "Option + F11",
    "Tab",
  ]);
});
