import { expect, type Page } from "@playwright/test";

// The group button on the right of the bottom bar (icon + current group name).
export const groupsCommand = (page: Page) =>
  page.locator(".group-select-command");
export const groupSelectCommand = (page: Page) =>
  page.locator(".group-select-command");
export const bookmarksCommand = (page: Page) =>
  page.locator('button[aria-controls="bookmarks-panel"]');
export const closedCommand = (page: Page) =>
  page.locator('button[aria-controls="closed-popup"]');
export const groupStatusName = (page: Page) =>
  page.locator(".group-current-value");
export const shortcutsCommand = (page: Page) =>
  page.locator('button[aria-controls="shortcuts-panel"]');

export async function openPanel(page: Page, panelId: string) {
  const command = page
    .locator(`button[aria-controls="${panelId}"]:visible`)
    .first();
  if (
    panelId === "shortcuts-panel" ||
    panelId === "settings-panel"
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

export async function openClosedPanel(page: Page) {
  await openPanel(page, "dashboard-panel");
  await toggleDashboardStatus(page, "closed");
  await expect(page.locator(".dashboard-closed-column")).toBeVisible();
}

export async function toggleDashboardStatus(page: Page, status: "icebox" | "closed") {
  const trigger = page.locator(".dashboard-options-trigger");
  if (await trigger.getAttribute("aria-expanded") !== "true") await trigger.click();
  await page.locator(`.dashboard-${status}-command`).click();
  await trigger.click();
}
export const openShortcutsPanel = (page: Page) =>
  openPanel(page, "shortcuts-panel");
export const openSettingsPanel = (page: Page) =>
  openPanel(page, "settings-panel");
export async function openGlobalSearchPanel(page: Page) {
  await page.locator('button[aria-controls="global-search-popup"]').click();
  await expect(page.locator("#global-search-popup")).toBeVisible();
}

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
  if (name === "All Group" || name === "Ungrouped") {
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name, exact: true }).click();
    return;
  }
  await groupsCommand(page).click();
  await page
    .locator(".group-item")
    .getByRole("button", { name, exact: true })
    .click();
  // Selecting keeps the dropdown open, so close it for the caller.
  await page.keyboard.press("Escape");
}
