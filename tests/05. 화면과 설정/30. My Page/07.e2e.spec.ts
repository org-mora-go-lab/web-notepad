import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("7. 서버 데이터가 준비될 때까지 My Page의 수신 영역만 스켈레톤으로 표시한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(
    context,
    signedSession({
      id: "my-skeleton-" + crypto.randomUUID(),
      nickname: "Skeleton user",
      expiresAt: Date.now() + 300000,
    }),
  );
  let releaseWorkspace!: () => void;
  const workspaceResponse = new Promise<void>((resolve) => {
    releaseWorkspace = resolve;
  });
  for (const path of ["**/api/notepad/history", "**/api/groups"]) {
    await page.route(path, async (route) => {
      await workspaceResponse;
      await route.continue();
    });
  }

  await page.goto("/my-page");
  await expect(
    page.getByRole("heading", { name: "Skeleton user", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".my-page-name-skeleton")).toHaveCount(0);
  await expect(page.locator(".my-page-metrics-skeleton")).toBeVisible();
  await expect(page.locator(".my-page-sync-skeleton")).toBeVisible();
  await expect(page.locator(".my-page-metrics")).toHaveCount(0);
  await expect(page.locator(".my-page-sync")).toHaveCount(0);

  releaseWorkspace();
  await expect(page.locator(".my-page-metrics")).toBeVisible();
  await expect(page.locator(".my-page-sync")).toBeVisible();
  await expect(page.locator(".my-page-metrics-skeleton")).toHaveCount(0);
  await expect(page.locator(".my-page-sync-skeleton")).toHaveCount(0);
});
