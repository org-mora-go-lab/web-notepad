import type { Page } from "@playwright/test";

export type CloudHistory = {
  count: number;
  latest: null | { eventId: string; snapshot: string; createdAt: number };
};

export async function readCloudHistory(page: Page): Promise<CloudHistory> {
  const response = await page.request.get("/api/notepad/history");
  if (!response.ok()) throw new Error(`History lookup failed: ${response.status()}`);
  return response.json() as Promise<CloudHistory>;
}
