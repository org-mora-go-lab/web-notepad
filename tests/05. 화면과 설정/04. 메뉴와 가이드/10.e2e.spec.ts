import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";

test("10. PC 하단 LOGIN은 DASHBOARD와 같은 좌우 간격으로 배치된다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await expect(page.locator(".footer-auth a.auth-command")).toBeVisible();

  const dashboardLabel = (await page
    .locator(".dashboard-command .status-label")
    .boundingBox())!;
  const loginIcon = (await page
    .locator(".footer-auth .auth-command svg")
    .boundingBox())!;

  expect(loginIcon.x - (dashboardLabel.x + dashboardLabel.width)).toBeCloseTo(
    20,
    0,
  );
});
