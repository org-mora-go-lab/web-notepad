import { expect, test } from "@playwright/test";

test("7. 모바일 하단에서 알림은 대시보드 왼쪽에 보인다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const notifications = page.locator(".notification-command");
  const dashboard = page.locator(".dashboard-command");
  await expect(notifications).toBeVisible();
  await expect(dashboard).toBeVisible();
  const bellBox = await notifications.boundingBox();
  const dashboardBox = await dashboard.boundingBox();
  expect(bellBox!.x + bellBox!.width).toBeLessThanOrEqual(dashboardBox!.x + 1);
});
