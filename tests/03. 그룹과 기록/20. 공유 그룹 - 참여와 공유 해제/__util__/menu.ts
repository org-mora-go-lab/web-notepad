import { expect, type Page } from "@playwright/test";

import { groupsCommand } from "../../../__util__";

export async function openSharingMenu(page: Page, id: string) {
  if (!(await page.locator("#groups-menu").isVisible()))
    await groupsCommand(page).click();
  const row = page.locator('[data-group-id="' + id + '"]');
  await row.locator(".group-select").click({ button: "right" });
  const menu = row.locator(".group-action-dropdown");
  await expect(menu).toBeVisible();
  return menu;
}

export async function openSharingCancellation(page: Page, id: string) {
  await page.goto("/board");
  await page.locator('.board-entry[data-group-id="' + id + '"]').click();
  await page
    .getByRole("button", { name: "Cancel Sharing", exact: true })
    .click();
  return page.getByRole("alertdialog", { name: "Cancel Sharing", exact: true });
}
