import type { Page } from "@playwright/test";


// Close a docked panel with its X button.
export const closePanelWithX = (page: Page, panelId: string) =>
  page.locator(`#${panelId} .side-panel-close`).click();

export const workspaceBounds = async (page: Page) =>
  (await page.locator(".workspace").boundingBox())!;
