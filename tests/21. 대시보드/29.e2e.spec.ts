import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { openPanel, writeStoredState } from "../__util__";
import { dashboardPanel } from "./__util__";

test("29. PC와 모바일에서 상태 제목 아래 카드만 스크롤한다", async ({ page }) => {
  await writeStoredState(page, { activeGroupId: "ungrouped", groups: [createGroupFixture("ungrouped", "Ungrouped", Array.from({ length: 30 }, (_, i) => createTabFixture(`tab-${i}`, `Task ${i}\nBody`, { tabColor: "gray" })))] });
  await openPanel(page, "dashboard-panel");
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    const panel = dashboardPanel(page);
    const title = panel.locator('.dashboard-column[data-status="todo"] h3');
    const cards = panel.locator('.dashboard-column[data-status="todo"] .dashboard-cards');
    const before = (await title.boundingBox())!;
    await cards.evaluate((el) => { el.scrollTop = 500; });
    expect(await cards.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect((await title.boundingBox())!.y).toBe(before.y);
    await expect(panel.locator(".side-panel-header")).toBeVisible();
  }
});
