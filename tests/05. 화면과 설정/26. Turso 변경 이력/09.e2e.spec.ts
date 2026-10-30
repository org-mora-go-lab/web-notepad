import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("9. 로그인 사용자의 첫 진입은 최신 DB 동기화가 끝날 때까지 skeleton을 표시한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(
    context,
    signedSession({
      id: `cloud-skeleton-${crypto.randomUUID()}`,
      nickname: "Cloud User",
      expiresAt: Date.now() + 60_000,
    }),
  );
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/notepad/history", async (route) => {
    if (route.request().method() === "GET") await gate;
    await route.continue();
  });
  await page.goto("/");
  await expect(
    page.getByRole("status", { name: "Syncing notes" }),
  ).toBeVisible();
  await expect(page.locator(".loading-skeleton-editor i")).toHaveCount(3);
  release();
  await expect(page.getByRole("status", { name: "Syncing notes" })).toHaveCount(
    0,
  );
  await expect(page.locator("textarea").first()).toBeVisible();
});
