import { expect, test } from "@playwright/test";

import { openShortcutsPanel, writeStoredState } from "../../__util__";

test("8. 영어와 한국어 단축키 안내에 Cmd+B 그룹 패널 토글을 표시한다", async ({ page }) => {
  for (const [language, action] of [["en", "Toggle group panel"], ["ko", "그룹 패널 열기·닫기"]]) {
    await writeStoredState(page, { settings: { language } });
    await openShortcutsPanel(page);
    const row = page.locator("#shortcuts-panel .shortcut-row", { hasText: action });
    await expect(row).toBeVisible();
    await expect(row.locator("kbd")).toHaveText("Cmd + B");
  }
});
