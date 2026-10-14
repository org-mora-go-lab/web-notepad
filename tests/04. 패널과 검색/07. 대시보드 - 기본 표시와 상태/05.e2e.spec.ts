import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../__util__";

test("5. PC는 세 상태 제목과 카드 컬럼을 가로로 나란히 표시한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const panel = dashboardPanel(page);
  const columns = panel.locator(".dashboard-column");
  const titles = panel.locator(".dashboard-statuses h3");
  const boxes = await Promise.all((await columns.all()).map((column) => column.boundingBox()));
  const titleBoxes = await Promise.all((await titles.all()).map((title) => title.boundingBox()));
  expect(boxes[0]!.y).toBeCloseTo(boxes[1]!.y, 0);
  expect(boxes[1]!.x).toBeGreaterThan(boxes[0]!.x);
  expect(boxes[2]!.x).toBeGreaterThan(boxes[1]!.x);
  for (let index = 0; index < 3; index++) {
    expect(titleBoxes[index]!.x).toBeCloseTo(boxes[index]!.x, 0);
    expect(titleBoxes[index]!.width).toBeCloseTo(boxes[index]!.width, 0);
  }
  await expect(panel.locator(".dashboard-column-status").first()).toBeHidden();
});
