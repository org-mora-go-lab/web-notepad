import type { Page } from "@playwright/test";

export async function closeActiveTab(page: Page) {
  await page.locator(".tab-item.is-active .tab-close").click();
}

// Types content into the active tab, then closes it immediately.
export async function closeActiveTabWithContent(page: Page, content: string) {
  await page.locator("textarea").fill(content);
  await closeActiveTab(page);
}
