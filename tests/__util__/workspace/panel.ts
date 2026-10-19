import { expect, type Page } from "@playwright/test";

// The group button on the left of the bottom bar (icon + current group name).
export const groupsCommand = (page: Page) =>
  page.locator(".group-select-command");
export const groupSelectCommand = (page: Page) =>
  page.locator(".group-select-command");
export const moreCommand = (page: Page) => page.locator(".footer .more-command");
export async function openBookmarksPanel(page: Page) {
  await groupsCommand(page).click();
  const activeGroup = page.locator("[data-group-id].is-active");
  await activeGroup.locator(".group-actions > button").click();
  await activeGroup.getByRole("button", { name: /BOOKMARK|북마크/i }).click();
  await expect(groupsCommand(page)).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
}
export const closedCommand = (page: Page) =>
  page.locator('button[aria-controls="closed-popup"]');
export const groupStatusName = (page: Page) =>
  page.locator(".group-current-value");
export const shortcutsCommand = (page: Page) =>
  page.locator('button[aria-controls="shortcuts-panel"]');

export async function openMoreMenu(page: Page) {
  const menu = page.locator("#footer-more-menu");
  if (!(await menu.isVisible())) await moreCommand(page).click();
  return menu;
}

export const openHeaderMenu = openMoreMenu;

export async function openPanel(page: Page, panelId: string) {
  if (panelId === "bookmarks-panel") {
    await openBookmarksPanel(page);
    return;
  }
  const command = page
    .locator(`button[aria-controls="${panelId}"]:visible`)
    .first();
  if (
    panelId === "shortcuts-panel" ||
    panelId === "settings-panel"
  ) {
    const tools = await openMoreMenu(page);
    if (panelId === "shortcuts-panel") {
      await tools.getByRole("button", { name: /GUIDE|사용 가이드/i }).click();
      await page.getByRole("dialog").getByRole("button", { name: /SHORTCUT|단축키/i }).click();
    } else {
      const settingsCommand = tools.getByRole("button", { name: /SETTINGS|설정/i });
      await expect(settingsCommand).toBeVisible();
      await settingsCommand.click();
    }
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
  await openMoreMenu(page);
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

// Opens the group sidebar, selects the group with the exact name and closes it when needed.
export async function switchGroup(page: Page, name: string) {
  if (name === "All Group" || name === "Ungrouped") {
    await groupsCommand(page).click();
    await page.getByRole("button", { name, exact: true }).click();
    if (await groupsCommand(page).getAttribute("aria-expanded") === "true")
      await page.keyboard.press("Escape");
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
