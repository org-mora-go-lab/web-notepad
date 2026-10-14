import type { Locator, Page } from "@playwright/test";

export async function beginDashboardDrag(page: Page, source: Locator) {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await source.dispatchEvent("dragstart", { dataTransfer });
  return dataTransfer;
}
