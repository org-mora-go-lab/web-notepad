import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, seedStoredStateOnLoad } from "../../__util__";

test("2. 닫힌 탭 카드가 많을 때 대시보드를 끝까지 스크롤할 수 있다", async ({ page }) => {
  const group = createGroupFixture("work", "Work", [createTabFixture("active-tab", "Current note")]);
  const closedTabs = Array.from({ length: 24 }, (_, index) => {
    const content = index === 23 ? "bottom closed note" : `closed note ${index + 1}`;
    const tab = createTabFixture(`closed-tab-${index + 1}`, content);
    return createClosedTabFixture(`closed-${index + 1}`, group.id, tab);
  });
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 2,
    closedTabs,
  });
  await page.setViewportSize({ width: 390, height: 640 });
  await openPanel(page, "dashboard-panel");

  const list = page.locator(".dashboard-list");
  await expect.poll(() => list.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  await list.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });

  const lastItem = page.locator(".dashboard-card", { hasText: "bottom closed note" });
  await expect(lastItem).toBeInViewport();
  await expect.poll(async () => {
    const box = await lastItem.boundingBox();
    return box !== null && box.y + box.height <= 640;
  }).toBe(true);
});
