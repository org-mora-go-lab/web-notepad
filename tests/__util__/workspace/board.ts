import { expect, type Page } from "@playwright/test";

export async function openBoard(page: Page) {
  await page.goto("/board");
  await expect(page).toHaveURL(/\/board$/, { timeout: 20000 });
  await expect(page.locator("#board-page")).toBeVisible();
}

export async function selectBoardPost(
  page: Page,
  title: string,
  groupId?: string,
) {
  await page
    .getByRole("searchbox", { name: "Search shared groups" })
    .fill(title);
  const card = groupId
    ? page.locator(`.board-entry[data-group-id="${groupId}"]`)
    : page.locator(".board-entry", { hasText: title });
  await card.click();
  await expect(page).toHaveURL(/[?&]post=/);
  await expect(page.locator(".board-detail")).toBeVisible();
}
