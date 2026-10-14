import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../__util__";

test("2. 모바일 fog는 대시보드 헤더 바로 아래에 48px 높이로 배치한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const header = panel.locator(".side-panel-header");
  const statuses = panel.locator(".dashboard-statuses");
  const list = panel.locator(".dashboard-list");
  await list.evaluate((element) => {
    element.scrollTop = 100;
  });

  const headerBounds = (await header.boundingBox())!;
  const statusBounds = (await statuses.boundingBox())!;
  const listBounds = (await list.boundingBox())!;
  expect(statusBounds.y).toBeCloseTo(headerBounds.y + headerBounds.height, 0);
  expect(statusBounds.y).toBeCloseTo(listBounds.y, 0);
  expect(
    await statuses.evaluate(
      (element) => getComputedStyle(element, "::after").height,
    ),
  ).toBe("48px");
});
