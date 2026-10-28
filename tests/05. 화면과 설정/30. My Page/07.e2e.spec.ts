import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
test("7. 프로필과 모든 작업공간 응답이 완료될 때까지 전체 본문 스켈레톤을 유지한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(
    context,
    signedSession({
      id: "my-page-gate-" + crypto.randomUUID(),
      nickname: "All data ready",
      expiresAt: Date.now() + 300000,
    }),
  );
  let privateRelease!: () => void, sharedRelease!: () => void;
  const privateGate = new Promise<void>((resolve) => {
    privateRelease = resolve;
  });
  const sharedGate = new Promise<void>((resolve) => {
    sharedRelease = resolve;
  });
  let privateRequested = false,
    sharedRequested = false;
  await page.route("**/api/notepad/history", async (route) => {
    if (route.request().method() === "GET") {
      privateRequested = true;
      await privateGate;
    }
    await route.continue();
  });
  await page.route("**/api/groups", async (route) => {
    sharedRequested = true;
    await sharedGate;
    await route.continue();
  });
  try {
    await page.goto("/my-page");
    await expect.poll(() => privateRequested && sharedRequested).toBe(true);
    await expect(page.locator(".my-page-skeleton")).toBeVisible();
    const avatarSkeleton = (await page
      .locator(".my-page-avatar-skeleton")
      .boundingBox())!;
    expect(avatarSkeleton.width).toBeCloseTo(76.8, 1);
    expect(avatarSkeleton.height).toBeCloseTo(76.8, 1);
    await expect(
      page.locator(
        ".my-page-profile:not(.is-loading), .my-page-metrics, .my-page-sync, .my-page-actions",
      ),
    ).toHaveCount(0);
    const response = page.waitForResponse((response) =>
      response.url().endsWith("/api/notepad/history"),
    );
    privateRelease();
    await response;
    await expect(page.locator(".my-page-skeleton")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "All data ready", exact: true }),
    ).toHaveCount(0);
    sharedRelease();
    await expect(
      page.getByRole("heading", { name: "All data ready", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".my-page-metrics")).toBeVisible();
    await expect(page.locator(".my-page-sync")).toBeVisible();
    await expect(page.locator(".my-page-skeleton")).toHaveCount(0);
  } finally {
    privateRelease();
    sharedRelease();
  }
});
