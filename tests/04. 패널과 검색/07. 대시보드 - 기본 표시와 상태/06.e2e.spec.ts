import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../__util__";

test("6. 모바일은 상태 제목과 각 카드 목록을 Todo·WIP·Closed 순서의 한 열로 표시한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const panel = dashboardPanel(page);
  const columns = panel.locator(".dashboard-column");
  const titles = panel.locator(".dashboard-column-status");
  await expect(panel.locator(".dashboard-statuses h3").first()).toBeHidden();
  await expect(titles).toHaveText(["Todo1", "WIP1", "Closed1"]);
  const boxes = await Promise.all((await columns.all()).map((column) => column.boundingBox()));
  expect(boxes[1]!.y).toBeGreaterThan(boxes[0]!.y);
  expect(boxes[2]!.y).toBeGreaterThan(boxes[1]!.y);
  for (let index = 0; index < 3; index++) {
    const title = (await titles.nth(index).boundingBox())!;
    const card = (await columns.nth(index).locator(".dashboard-card").first().boundingBox())!;
    expect(card.y).toBeGreaterThanOrEqual(title.y + title.height);
  }
});
