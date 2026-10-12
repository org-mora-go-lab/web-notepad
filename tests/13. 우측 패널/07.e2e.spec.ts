import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { RIGHT_PANEL_VIEWPORTS } from "./__constant__";

test("7. Escape로 패널 진입 버튼의 포커스를 해제하고 하단·MENU 키보드 탐색을 유지한다", async ({ page }) => {
  await page.goto("/");

  for (const { viewport, panelIds } of RIGHT_PANEL_VIEWPORTS) {
    await page.setViewportSize(viewport);

    for (const panelId of [...panelIds].reverse()) {
      const toggle = page.locator(`button[aria-controls="${panelId}"]`).first();
      const panel = page.locator(`#${panelId}`);
      await openPanel(page, panelId);
      await expect(panel).toHaveAttribute("aria-hidden", "false");
      const menuKeys: Record<string, string[]> = {
        "closed-panel": ["End", "ArrowUp"],
        "settings-panel": ["End", "ArrowUp", "ArrowUp", "ArrowUp"],
        "shortcuts-panel": ["ArrowDown"],
        "global-search-panel": ["End"],
      };
      const inMenu = panelId in menuKeys;
      if (inMenu) await expect(page.getByRole("button", { name: "MENU", exact: true })).toBeFocused();
      else await expect(toggle).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(panel).toHaveAttribute("aria-hidden", "true");
      await expect(toggle).not.toBeFocused();
      await expect(toggle).toHaveCSS("outline-style", "none");
      await expect(toggle).toHaveCSS("border-left-width", "0px");
      await expect(toggle).toHaveCSS("border-right-width", "0px");

      if (inMenu) {
        const menu = page.getByRole("button", { name: "MENU", exact: true });
        await expect(menu).not.toBeFocused();
        await menu.press("Enter");
        for (const key of menuKeys[panelId]) await page.keyboard.press(key);
        await expect(toggle).toBeFocused();
        await expect(toggle).not.toHaveCSS("outline-style", "none");
        await page.keyboard.press("Escape");
        continue;
      }

      const visibleIds = await page.locator(".status-meta .status-command:visible").evaluateAll(
        (commands) => commands.map((command) => command.getAttribute("aria-controls")),
      );
      const index = visibleIds.indexOf(panelId);
      const fromNext = index < visibleIds.length - 1;
      await page.locator(".status-meta .status-command:visible").nth(fromNext ? index + 1 : index - 1).focus();
      await page.keyboard.press(fromNext ? "Shift+Tab" : "Tab");
      await expect(toggle).toBeFocused();
      await expect(toggle).not.toHaveCSS("outline-style", "none");
    }
  }
});
