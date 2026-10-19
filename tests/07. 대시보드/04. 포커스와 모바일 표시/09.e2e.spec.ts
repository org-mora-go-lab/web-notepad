import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { dashboardPanel, openPanel, seedDashboardTabs } from "../../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("9. 모바일에서 Icebox와 Closed를 반복 전환해도 상태 영역을 한 열로 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await page.locator(".dashboard-options-trigger").click();

  const panel = dashboardPanel(page);
  const columns = panel.locator(".dashboard-column");
  const icebox = panel.locator(".dashboard-icebox-command");
  const closed = panel.locator(".dashboard-closed-command");
  await icebox.click();

  const expectSingleColumn = async (count: number) => {
    await expect(columns).toHaveCount(count);
    await expect(panel.locator(".dashboard-board")).toHaveCSS(
      "grid-template-columns",
      /^\d+(?:\.\d+)?px$/,
    );
    const boxes = await columns.evaluateAll((elements) =>
      elements.map((element) => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      }),
    );
    for (let index = 1; index < boxes.length; index += 1) {
      expect(boxes[index].x).toBeCloseTo(boxes[0].x, 0);
      expect(boxes[index].width).toBeCloseTo(boxes[0].width, 0);
      expect(boxes[index].y - (boxes[index - 1].y + boxes[index - 1].height)).toBeCloseTo(30, 0);
    }
  };

  await expectSingleColumn(4);
  for (let cycle = 0; cycle < 2; cycle += 1) {
    await icebox.click();
    await expectSingleColumn(3);
    await closed.click();
    await expectSingleColumn(4);
    await icebox.click();
    await expectSingleColumn(5);
    await icebox.click();
    await expectSingleColumn(4);
    await closed.click();
    await expectSingleColumn(3);
    await icebox.click();
    await expectSingleColumn(4);
  }
});
