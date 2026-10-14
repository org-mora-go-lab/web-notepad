import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("8. 카드 테두리는 왼쪽 강조선 없이 모든 방향을 같은 모양으로 표시한다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "in-progress").locator(".dashboard-card");
  const borders = await card.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      widths: [
        style.borderTopWidth,
        style.borderRightWidth,
        style.borderBottomWidth,
        style.borderLeftWidth,
      ],
      colors: [
        style.borderTopColor,
        style.borderRightColor,
        style.borderBottomColor,
        style.borderLeftColor,
      ],
    };
  });

  expect(new Set(borders.widths)).toEqual(new Set(["1px"]));
  expect(new Set(borders.colors).size).toBe(1);
});
