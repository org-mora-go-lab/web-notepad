import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../__util__";

test("4. 모바일 상태 제목과 카드는 하나의 세로 흐름에서 함께 스크롤한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const list = panel.locator(".dashboard-list");
  const title = panel.locator(".dashboard-column-status").first();
  const card = panel.locator(".dashboard-card").first();
  const titleY = await title.evaluate((element) => element.getBoundingClientRect().y);
  const cardY = await card.evaluate((element) => element.getBoundingClientRect().y);
  await list.evaluate((element) => { element.scrollTop = 200; });
  const scroll = await list.evaluate((element) => element.scrollTop);

  expect(await title.evaluate((element) => element.getBoundingClientRect().y)).toBeCloseTo(titleY - scroll, 0);
  expect(await card.evaluate((element) => element.getBoundingClientRect().y)).toBeCloseTo(cardY - scroll, 0);
});
