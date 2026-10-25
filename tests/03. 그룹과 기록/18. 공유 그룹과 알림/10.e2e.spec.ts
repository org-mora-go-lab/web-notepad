import { expect, test } from "@playwright/test";

test("10. 좁은 모바일 화면에서 알림과 대시보드 라벨은 겹치지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const alertLabel = page.locator(".notification-command .status-label");
  const boardLabel = page.locator(".dashboard-command .status-label");
  await expect(alertLabel).toHaveText("ALERTS");
  const alert = (await alertLabel.boundingBox())!;
  const board = (await boardLabel.boundingBox())!;
  expect(alert.x + alert.width).toBeLessThan(board.x);
});
