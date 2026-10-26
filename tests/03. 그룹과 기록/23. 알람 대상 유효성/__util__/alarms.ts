import { expect, type Page } from "@playwright/test";

import { openAccountMenu } from "../../../__util__";

export async function changeSharedNote(page: Page, id: string, content: string) {
  const record = (await (await page.request.get("/api/groups")).json()).groups.find((group: { id: string }) => group.id === id);
  const result = await page.request.post("/api/groups/update", { data: { id, baseRevision: record.revision,
    data: { ...record.data, tabs: record.data.tabs.map((tab: { content: string }) => ({ ...tab, content, title: content })) } } });
  expect(result.ok()).toBe(true);
}
export async function openAlarms(page: Page) {
  const refreshed = page.waitForResponse(r => r.url().endsWith("/api/groups/notifications") && r.request().method() === "GET");
  await page.evaluate(() => window.dispatchEvent(new Event("focus"))); await refreshed;
  const account = await openAccountMenu(page);
  await account.getByRole("menuitem", { name: "Alarm", exact: true }).click();
  return page.locator("#footer-notifications-panel");
}
