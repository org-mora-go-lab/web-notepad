import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../__util__";

test("1. PC fog는 상태 제목 바로 아래에 48px 높이로 배치한다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const statuses = panel.locator(".dashboard-statuses");
  const list = panel.locator(".dashboard-list");
  await list.evaluate((element) => {
    element.scrollTop = 100;
  });

  const statusBounds = (await statuses.boundingBox())!;
  const listBounds = (await list.boundingBox())!;
  expect(statusBounds.y + statusBounds.height).toBeCloseTo(listBounds.y, 0);
  expect(
    await statuses.evaluate(
      (element) => getComputedStyle(element, "::after").height,
    ),
  ).toBe("48px");
});
