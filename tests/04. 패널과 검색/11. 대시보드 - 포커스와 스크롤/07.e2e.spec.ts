import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../__util__";

test("7. 상태와 카드 콘텐츠는 dashboard-list 하나만 세로 스크롤한다", async ({ page }) => {
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const scrollers = await panel.evaluate((element) => Array.from(element.querySelectorAll("*"))
    .filter((child) => /auto|scroll/.test(getComputedStyle(child).overflowY) && child.scrollHeight > child.clientHeight)
    .map((child) => child.className));
  expect(scrollers).toEqual(["dashboard-list"]);
  await expect(panel.locator(".dashboard-column").first()).toHaveCSS("overflow-y", "visible");
});
