import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardPanel } from "./__util__";

test("29. PC와 모바일에서 상태 제목을 고정하고 전체 카드 영역에 스크롤 하나만 표시한다", async ({ page }) => {
  await writeStoredState(page, { activeGroupId: "ungrouped", groups: [createGroupFixture("ungrouped", "Ungrouped", Array.from({ length: 30 }, (_, i) => createTabFixture(`tab-${i}`, `Task ${i}\nBody`, { tabColor: i % 2 ? "green" : "gray" })))] });
  await openPanel(page, "dashboard-panel");
  // Reserve a scrollbar gutter even on systems that use overlay scrollbars.
  await page.addStyleTag({ content: ".dashboard-list { scrollbar-width: auto; scrollbar-gutter: stable; } .dashboard-list::-webkit-scrollbar { width: 16px; }" });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    const panel = dashboardPanel(page);
    const titles = panel.locator(".dashboard-statuses h3");
    const list = panel.locator(".dashboard-list");
    const statuses = panel.locator(".dashboard-statuses");
    await expect.poll(() => list.evaluate((el) => (el as HTMLElement).offsetWidth - el.clientWidth)).toBeGreaterThan(0);
    const scrollbarWidth = await list.evaluate((el) => (el as HTMLElement).offsetWidth - el.clientWidth);
    await expect(statuses).toHaveCSS("padding-right", `${14 + scrollbarWidth}px`);
    if (width === 1280) {
      const columns = panel.locator(".dashboard-column");
      for (let index = 0; index < 3; index++) {
        const titleBox = (await titles.nth(index).boundingBox())!;
        const columnBox = (await columns.nth(index).boundingBox())!;
        expect(titleBox.x).toBeCloseTo(columnBox.x, 0);
        expect(titleBox.width).toBeCloseTo(columnBox.width, 0);
      }
    }
    await list.evaluate((el) => { el.scrollTop = 0; });
    const before = await Promise.all((await titles.all()).map((title) => title.boundingBox()));
    const card = panel.locator(".dashboard-card").first();
    const cardBefore = (await card.boundingBox())!;
    await list.evaluate((el) => { el.scrollTop = 200; });
    const scroll = await list.evaluate((el) => el.scrollTop);
    expect(scroll).toBeGreaterThan(0);
    expect((await card.boundingBox())!.y).toBeCloseTo(cardBefore.y - scroll, 0);
    for (const [index, title] of (await titles.all()).entries()) {
      await expect(title).toBeVisible();
      expect((await title.boundingBox())!.y).toBe(before[index]!.y);
    }
    const scrollers = await panel.evaluate((el) => Array.from(el.querySelectorAll("*"))
      .filter((child) => /auto|scroll/.test(getComputedStyle(child).overflowY) && child.scrollHeight > child.clientHeight)
      .map((child) => child.className));
    expect(scrollers).toEqual(["dashboard-list"]);
    await expect(panel.locator(".side-panel-header")).toBeVisible();
  }
  await page.setViewportSize({ width: 1280, height: 4000 });
  await dashboardPanel(page).locator(".dashboard-list").evaluate((el) => { el.style.scrollbarGutter = "auto"; });
  await expect.poll(() => dashboardPanel(page).locator(".dashboard-list").evaluate((el) => el.scrollHeight <= el.clientHeight)).toBe(true);
  await expect(dashboardPanel(page).locator(".dashboard-statuses")).toHaveCSS("padding-right", "14px");
});
