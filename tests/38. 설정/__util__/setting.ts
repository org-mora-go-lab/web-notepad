import type { Page } from "@playwright/test";

export const settingsPanel = (page: Page) => page.locator("#settings-panel");

// Radio for a font scale such as "120%".
export const fontScaleRadio = (page: Page, label: string) =>
  settingsPanel(page).getByRole("radio", { name: label, exact: true });

// Radio for `color` in the 1-based `order` slot of the tab color cycle.
export const tabColorRadio = (page: Page, order: number, color: string) =>
  settingsPanel(page)
    .getByRole("radiogroup", { name: `Tab color ${order}` })
    .getByRole("radio", { name: color, exact: true });

export const closeSettingsPanel = (page: Page) =>
  page.getByRole("button", { name: "설정 닫기" }).click();
