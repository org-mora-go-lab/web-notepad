import { expect, test } from "@playwright/test";

test("2. 비로그인 직접 접근은 로그인 안내를 표시하고 개인 통계를 숨긴다", async ({
  page,
}) => {
  await page.goto("/my-page");
  await expect(page.locator('a[href="/api/auth/oauth/kakao"]')).toBeVisible();
  await expect(page.locator(".my-page-metrics")).toHaveCount(0);
});
