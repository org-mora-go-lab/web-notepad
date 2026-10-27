import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser, expectTabSavingLine } from "../../__util__";

test("8. 수정한 탭을 떠나도 저장 애니메이션은 해당 탭에만 표시한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(
    context,
    signedSession({
      id: "background-save-" + crypto.randomUUID(),
      nickname: "Cloud User",
      expiresAt: Date.now() + 300_000,
    }),
  );
  const initial = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/notepad/history") &&
      response.request().method() === "GET",
  );
  await page.goto("/");
  await initial;
  await expect(page.locator("button.auth-command")).toBeVisible();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/notepad/history", async (route) => {
    if (route.request().method() === "POST") await gate;
    await route.continue();
  });
  try {
    await page.locator("textarea").first().fill("Edited tab");
    await page.getByRole("button", { name: "New tab", exact: true }).click();
    await expect(page.locator(".home")).toHaveAttribute(
      "data-cloud-save",
      "saving",
      { timeout: 10_000 },
    );
    await expectTabSavingLine(
      page.locator(".tab-item").filter({
        has: page.getByRole("tab", { name: "Edited tab", exact: true }),
      }),
      true,
    );
    await expectTabSavingLine(page.locator(".tab-item.is-active"), false);
    await expect(page.locator(".tab-item.is-active .tab-title")).toHaveCSS(
      "animation-name",
      "none",
    );
  } finally {
    release();
  }
});
