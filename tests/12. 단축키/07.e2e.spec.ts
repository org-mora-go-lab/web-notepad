import { expect, test } from "@playwright/test";

import { openShortcutsPanel } from "../__util__";

test("7. SHORTCUT 패널에 실제 키보드 단축키와 Shift+클릭 줄 범위 선택·해제 안내를 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  await openShortcutsPanel(page);

  const shortcutsPanel = page.locator("#shortcuts-panel");
  await expect(shortcutsPanel).toHaveAttribute("aria-hidden", "false");
  await expect(shortcutsPanel.locator(".shortcut-row dt")).toHaveText([
    "Add a new tab",
    "Close the active tab",
    "Move between tabs",
    "Select all content",
    "Move to the right pane",
    "Move to the left pane",
    "Insert a tab character",
    "Select or clear a line range",
  ]);
  await expect(shortcutsPanel.locator(".shortcut-row kbd")).toHaveText([
    "Option + Tab",
    "Option + Backspace",
    "Option + Arrow Up",
    "Option + Arrow Down",
    "Cmd + A",
    "Option + A",
    "Option + F12",
    "Option + F11",
    "Tab",
    "Shift + Click",
  ]);
  await expect(
    shortcutsPanel.locator(".shortcut-row").filter({ hasText: "Select or clear a line range" }),
  ).toContainText("Shift + Click");
});
