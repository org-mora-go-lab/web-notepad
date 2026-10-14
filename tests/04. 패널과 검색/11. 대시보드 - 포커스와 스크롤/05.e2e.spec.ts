import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../__util__";

test("5. PC 상태 제목은 카드 목록을 스크롤해도 고정되고 카드는 함께 이동한다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const list = panel.locator(".dashboard-list");
  const titles = panel.locator(".dashboard-statuses h3");
  const card = panel.locator(".dashboard-card").first();
  const titleY = await titles.evaluateAll((items) => items.map((item) => item.getBoundingClientRect().y));
  const cardY = await card.evaluate((element) => element.getBoundingClientRect().y);
  await list.evaluate((element) => { element.scrollTop = 200; });
  const scroll = await list.evaluate((element) => element.scrollTop);

  expect(await titles.evaluateAll((items) => items.map((item) => item.getBoundingClientRect().y))).toEqual(titleY);
  expect(await card.evaluate((element) => element.getBoundingClientRect().y)).toBeCloseTo(cardY - scroll, 0);
});
