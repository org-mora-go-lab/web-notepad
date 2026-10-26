import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser, expectTabSavingLine } from "../../__util__";

test("7. 탭을 열거나 전환하는 저장에는 제목 애니메이션을 표시하지 않는다", async ({ page, context }) => {
  await authenticateBrowser(context, signedSession({ id: "navigation-save-" + crypto.randomUUID(), nickname: "Cloud User", expiresAt: Date.now() + 300_000 }));
  await page.goto("/"); await expect(page.locator("button.auth-command")).toBeVisible();
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/notepad/history", async route => { if (route.request().method() === "POST") await gate; await route.continue(); });
  try {
    await page.getByRole("button", { name: "New tab", exact: true }).click();
    await page.getByRole("tab").first().click();
    await page.getByRole("tab").last().click();
    await expect(page.locator(".home")).toHaveAttribute("data-cloud-save", "pending");
    for (const tab of await page.locator(".tab-item").all()) { await expectTabSavingLine(tab, false); await expect(tab.locator(".tab-title")).toHaveCSS("animation-name", "none"); }
    await expect(page.locator(".home")).toHaveAttribute("data-cloud-save", "saving", { timeout: 10_000 });
    for (const title of await page.locator(".tab-title").all()) await expect(title).toHaveCSS("animation-name", "none");
  } finally { release(); }
});
