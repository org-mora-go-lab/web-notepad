import { expect, test } from "@playwright/test";

import { openShortcutsPanel } from "../../__util__";

test("5. SHORTCUT 패널은 편집 실행 취소와 다시 실행 단축키를 안내한다", async ({
  page,
}) => {
  await page.goto("/");
  await openShortcutsPanel(page);
  const panel = page.locator("#shortcuts-panel");

  await expect(
    panel.locator(".shortcut-row", { hasText: "Undo edit" }),
  ).toContainText("Cmd + Z");
  await expect(
    panel.locator(".shortcut-row", { hasText: "Redo edit" }),
  ).toContainText("Cmd + Shift + Z");
});
