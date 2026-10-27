import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
test("8. 작업공간 수신 실패 시 부분 통계를 표시하지 않고 재시도로 완성 화면을 복구한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(
    context,
    signedSession({
      id: "my-page-retry-" + crypto.randomUUID(),
      nickname: "Complete workspace",
      expiresAt: Date.now() + 300000,
    }),
  );
  await page.route("**/api/groups", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await page.goto("/my-page");
  const notice = page.locator('.my-page-notice[role="alert"]');
  await expect(notice).toContainText("Could not load your workspace.");
  await expect(
    page.locator(".my-page-metrics, .my-page-profile:not(.is-loading)"),
  ).toHaveCount(0);
  await page.unroute("**/api/groups");
  await notice.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Complete workspace", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".my-page-metrics")).toBeVisible();
  await expect(notice).toHaveCount(0);
});
