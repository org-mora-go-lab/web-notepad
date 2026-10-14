import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../__util__";

test("4. 모바일 대시보드 헤더는 카드 목록을 스크롤해도 상단에 고정한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const list = panel.locator(".dashboard-list");
  const header = panel.locator(".side-panel-header");
  const y = await header.evaluate((element) => element.getBoundingClientRect().y);

  await list.evaluate((element) => {
    element.scrollTop = 200;
  });

  await expect
    .poll(() => header.evaluate((element) => element.getBoundingClientRect().y))
    .toBe(y);
});
