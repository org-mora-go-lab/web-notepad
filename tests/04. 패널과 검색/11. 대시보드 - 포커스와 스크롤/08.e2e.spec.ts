import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../__util__";

test("8. PC 상태 제목 여백은 스크롤바 너비를 반영하고 사라지면 14px로 돌아간다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await seedScrollableDashboard(page);
  await page.addStyleTag({ content: ".dashboard-list { scrollbar-width: auto; scrollbar-gutter: stable; } .dashboard-list::-webkit-scrollbar { width: 16px; }" });
  const panel = dashboardPanel(page);
  const list = panel.locator(".dashboard-list");
  const statuses = panel.locator(".dashboard-statuses");
  const width = await list.evaluate((element) => (element as HTMLElement).offsetWidth - element.clientWidth);
  await expect(statuses).toHaveCSS("padding-right", `${14 + width}px`);

  await page.setViewportSize({ width: 1280, height: 4000 });
  await list.evaluate((element) => { (element as HTMLElement).style.scrollbarGutter = "auto"; });
  await expect.poll(() => list.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);
  await expect(statuses).toHaveCSS("padding-right", "14px");
});
