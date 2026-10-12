import { expect, type Page } from "@playwright/test";

import { openSettingsPanel } from "./panel";

// Picks `color` (English label such as "Red") for the 1-based `order` slot of the tab color cycle, then closes the settings panel.
export async function selectTabColorSetting(page: Page, order: number, color: string) {
  await openSettingsPanel(page);
  const panel = page.locator("#settings-panel");
  const radio = panel
    .getByRole("radiogroup", { name: `Tab color ${order}` })
    .getByRole("radio", { name: color, exact: true });
  await radio.check();
  await expect(radio).toBeChecked();
  await page.getByRole("button", { name: "설정 닫기" }).click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
}
