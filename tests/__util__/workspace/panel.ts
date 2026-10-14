import { expect, type Page } from "@playwright/test";

// The group button on the right of the bottom bar (icon + current group name).
export const groupsCommand = (page: Page) =>
  page.locator(".group-select-command");
export const groupSelectCommand = (page: Page) =>
  page.locator(".group-select-command");
export const bookmarksCommand = (page: Page) =>
  page.locator('button[aria-controls="bookmarks-panel"]');
export const closedCommand = (page: Page) =>
  page.locator('button[aria-controls="closed-panel"]');
export const groupStatusName = (page: Page) =>
  page.locator(".group-select-name");
export const shortcutsCommand = (page: Page) =>
  page.locator('button[aria-controls="shortcuts-panel"]');

export async function openPanel(page: Page, panelId: string) {
  const command = page
    .locator(`button[aria-controls="${panelId}"]:visible`)
    .first();
  if (
    panelId === "closed-panel" ||
    panelId === "shortcuts-panel" ||
    panelId === "settings-panel" ||
    panelId === "global-search-panel"
  ) {
    const menu = page.locator(".additional-tools-trigger");
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(command).toBeVisible();
    await command.click();
  } else if (
    await page.locator('.side-panel-drawer[aria-hidden="false"]').count()
  ) {
    // An overlay can cover the footer; keyboard activation remains available.
    await command.press("Enter");
  } else {
    await command.click();
  }
  await expect(page.locator(`#${panelId}`)).toHaveAttribute(
    "aria-hidden",
    "false",
  );
}

export const openClosedPanel = (page: Page) => openPanel(page, "closed-panel");
export const openShortcutsPanel = (page: Page) =>
  openPanel(page, "shortcuts-panel");
export const openSettingsPanel = (page: Page) =>
  openPanel(page, "settings-panel");
export const openGlobalSearchPanel = (page: Page) =>
  openPanel(page, "global-search-panel");

// Creates a group from the open group dropdown.
export async function createGroup(page: Page, name: string) {
  await page.getByRole("textbox", { name: "New group name" }).fill(name);
  await page.getByRole("button", { name: "Create group" }).click();
}

// Opens the group dropdown, creates the groups, and closes it again.
export async function createGroups(page: Page, ...names: string[]) {
  await groupsCommand(page).click();
  for (const name of names) await createGroup(page, name);
  await page.keyboard.press("Escape");
}

// Opens the group dropdown, selects the group with the exact name and closes the dropdown.
export async function switchGroup(page: Page, name: string) {
  await groupsCommand(page).click();
  await page
    .locator(".group-item")
    .getByRole("button", { name, exact: true })
    .click();
  // Selecting keeps the dropdown open, so close it for the caller.
  await page.keyboard.press("Escape");
}
