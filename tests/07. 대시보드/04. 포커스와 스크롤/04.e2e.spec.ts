import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../../__util__";

test("4. 모바일에서 아래로 스크롤하면 Todo, Doing, Done을 차례로 상단에 고정한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const titles = {
    todo: panel.locator('.dashboard-column-status[data-status="todo"]'),
    doing: panel.locator(
      '.dashboard-column-status[data-status="in-progress"]',
    ),
    done: panel.locator('.dashboard-column-status[data-status="done"]'),
  };
  const headerBox = (await panel.locator(".side-panel-header").boundingBox())!;
  const stickyY = headerBox.y + headerBox.height + 20;

  expect((await titles.todo.boundingBox())!.y).toBeCloseTo(stickyY, 0);
  await titles.todo.evaluate((element) =>
    element.scrollIntoView({ block: "start" }),
  );
  expect((await titles.todo.boundingBox())!.y).toBeCloseTo(stickyY, 0);
  await titles.doing.evaluate((element) =>
    element.scrollIntoView({ block: "start" }),
  );
  expect((await titles.doing.boundingBox())!.y).toBeCloseTo(stickyY, 0);
  await titles.done.evaluate((element) =>
    element.scrollIntoView({ block: "start" }),
  );
  expect((await titles.done.boundingBox())!.y).toBeCloseTo(stickyY, 0);
});
