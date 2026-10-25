import { expect, type Page } from "@playwright/test";

import { openMoreMenu } from "./panel";

export async function openBoard(page: Page) {
  const menu = await openMoreMenu(page);
  await menu.getByRole("button", { name: "BOARD", exact: true }).click();
  await expect(page.locator("#board-panel")).toBeVisible();
}

export async function selectBoardPost(page: Page, title: string) {
  await page
    .getByRole("searchbox", { name: "Search shared groups" })
    .fill(title);
  await page.locator(".board-card", { hasText: title }).click();
  await expect(page.locator(".board-detail h3")).toHaveText(title);
}
