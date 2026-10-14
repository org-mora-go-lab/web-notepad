import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { groupsCommand, openGlobalSearchPanel } from "../../__util__";

test("4. PC와 모바일의 에디터·검색창·그룹 입력 커서는 그레이다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await expect(editor).toBeVisible();
  const gray = "rgb(184, 184, 176)";

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await editor.focus();
    await expect(editor).toHaveCSS("caret-color", gray);
    await openGlobalSearchPanel(page);
    await expect(page.locator("#global-search-panel input")).toHaveCSS("caret-color", gray);
    await page.keyboard.press("Escape");
    await groupsCommand(page).click();
    await expect(page.locator(".group-create-form input")).toHaveCSS("caret-color", gray);
    await page.keyboard.press("Escape");
  }
});
