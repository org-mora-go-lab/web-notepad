import type { Page } from "@playwright/test";

// The pin toggle in the header of an open right panel.
export const panelPinButton = (page: Page, panelId: string) =>
  page.locator(`#${panelId} .side-panel-pin`);

// The X button, the only way to close a pinned panel.
export const closePanelWithX = (page: Page, panelId: string) =>
  page.locator(`#${panelId} .side-panel-close`).click();

export const workspaceBounds = async (page: Page) =>
  (await page.locator(".workspace").boundingBox())!;
