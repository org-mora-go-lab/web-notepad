import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser, createGroups } from "../../__util__";
import { readCloudHistory } from "./__util__";

test("1. 글 수정 후 3초 대기가 끝나 저장 중일 때만 제목을 반짝인다", async ({ page, context }) => {
  await authenticateBrowser(context, signedSession({ id: "cloud-batch-" + crypto.randomUUID(), nickname: "Cloud User", expiresAt: Date.now() + 300_000 }));
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/notepad/history", async route => { if (route.request().method() === "POST") await gate; await route.continue(); });
  const initial = page.waitForResponse(response => response.url().endsWith("/api/notepad/history") && response.request().method() === "GET");
  await page.goto("/"); await initial;
  await expect(page.locator("button.auth-command")).toContainText("Cloud User");
  await createGroups(page, "Batch group");
  await page.locator("textarea").first().fill("첫 번째 글");
  await page.locator("textarea").first().fill("마지막 글");
  const lastEdit = Date.now(); const title = page.locator(".tab-item.is-active .tab-title").first();
  try {
    await expect(page.locator(".home")).toHaveAttribute("data-cloud-save", "pending");
    await expect(title).toHaveCSS("animation-name", "none");
    expect((await readCloudHistory(page)).count).toBe(0);
    await expect(page.locator(".home")).toHaveAttribute("data-cloud-save", "saving", { timeout: 10_000 });
    expect(Date.now() - lastEdit).toBeGreaterThanOrEqual(2800);
    await expect(title).toHaveCSS("animation-name", "cloud-title-shimmer");
    await expect(page.locator(".cloud-save-status")).toHaveCount(0);
  } finally { release(); }
  await expect(page.locator(".home")).toHaveAttribute("data-cloud-save", "saved", { timeout: 15_000 });
  await expect(title).toHaveCSS("animation-name", "none");
  const history = await readCloudHistory(page); expect(history.count).toBe(1);
  expect(history.latest!.snapshot).toContain("마지막 글");
});
