import { expect, test } from "@playwright/test";

import {
  dashboardColumn,
  dashboardPanel,
  seedScrollableDashboard,
} from "../__util__";

test("5. 모바일에서 위로 스크롤하면 Doing과 Todo를 다시 상단에 고정한다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const doingTitle = panel.locator(
    '.dashboard-column-status[data-status="in-progress"]',
  );
  const todoTitle = panel.locator(
    '.dashboard-column-status[data-status="todo"]',
  );
  const stickyY = (await todoTitle.boundingBox())!.y;

  await panel
    .locator('.dashboard-column-status[data-status="done"]')
    .evaluate((element) => element.scrollIntoView({ block: "start" }));
  await dashboardColumn(page, "in-progress")
    .locator(".dashboard-card")
    .first()
    .evaluate((element) => element.scrollIntoView({ block: "start" }));
  expect((await doingTitle.boundingBox())!.y).toBeCloseTo(stickyY, 0);

  await dashboardColumn(page, "todo")
    .locator(".dashboard-card")
    .first()
    .evaluate((element) => element.scrollIntoView({ block: "start" }));
  expect((await todoTitle.boundingBox())!.y).toBeCloseTo(stickyY, 0);
});
