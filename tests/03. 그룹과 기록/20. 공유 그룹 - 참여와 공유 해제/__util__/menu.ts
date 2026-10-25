import { expect, type Page } from "@playwright/test";

import { groupsCommand } from "../../../__util__";

export async function openSharingMenu(page: Page, id: string, method: "context" | "button" = "button") {
  if (!await page.locator("#groups-menu").isVisible()) await groupsCommand(page).click();
  const row = page.locator('[data-group-id="' + id + '"]');
  if (method === "context") await row.locator(".group-select").click({ button: "right" });
  else await row.locator(".group-actions > button").click();
  const menu = row.locator(".group-action-dropdown"); await expect(menu).toBeVisible(); return menu;
}
