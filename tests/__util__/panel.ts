import { expect, type Page } from "@playwright/test";

export const groupsCommand = (page: Page) => page.locator(".group-status-command");
export const groupSelectCommand = (page: Page) => page.locator(".group-select-command");
export const bookmarksCommand = (page: Page) =>
  page.locator('button[aria-controls="bookmarks-panel"]');
export const closedCommand = (page: Page) =>
  page.locator('button[aria-controls="closed-panel"]');
export const groupStatusName = (page: Page) => page.locator(".group-status-name");
export const shortcutsCommand = (page: Page) =>
  page.locator('button[aria-controls="shortcuts-panel"]');

export async function openPanel(page: Page, panelId: string) {
  const command = page.locator(`button[aria-controls="${panelId}"]`).first();
  if (panelId === "closed-panel" || panelId === "shortcuts-panel" || panelId === "settings-panel") {
    const menu = page.getByRole("button", { name: "MENU", exact: true });
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(command).toBeVisible();
    await command.click();
  } else {
    await command.press("Enter");
  }
  await expect(page.locator(`#${panelId}`)).toHaveAttribute("aria-hidden", "false");
}

export const openClosedPanel = (page: Page) => openPanel(page, "closed-panel");
export const openShortcutsPanel = (page: Page) => openPanel(page, "shortcuts-panel");
export const openSettingsPanel = (page: Page) => openPanel(page, "settings-panel");

// Creates a group from the open groups panel.
export async function createGroup(page: Page, name: string) {
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill(name);
  await page.getByRole("button", { name: "그룹 생성" }).click();
}

// Opens the groups panel, creates the groups, and closes the panel again.
export async function createGroups(page: Page, ...names: string[]) {
  await groupsCommand(page).click();
  for (const name of names) await createGroup(page, name);
  await page.getByRole("button", { name: "그룹 닫기" }).click();
}

// Opens the groups panel and selects the group with the exact name.
export async function switchGroup(page: Page, name: string) {
  await groupsCommand(page).click();
  await page.locator(".group-item").getByRole("button", { name, exact: true }).click();
}
