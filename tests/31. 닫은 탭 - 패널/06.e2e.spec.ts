import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../__fixture__";
import { expectPanelTimes, openClosedPanel, seedStoredStateOnLoad } from "../__util__";

test.use({ timezoneId: "UTC" });

test("6. 닫은 시각은 그룹명 길이와 무관하게 고정된 우측 영역에 영어로 두 줄 표시한다", async ({ page }) => {
  const groups = ["Short", "Long group name for fixed timestamp layout"].map((name, index) =>
    createGroupFixture(`group-${index}`, name, [createTabFixture(`tab-${index}`, "Note")]),
  );
  await seedStoredStateOnLoad(page, {
    activeGroupId: groups[0].id,
    groups,
    closedTabs: groups.map((group, index) => ({
      ...createClosedTabFixture(`closed-${index}`, group.id, createTabFixture(`closed-tab-${index}`, "Note")),
      closedAt: Date.UTC(2026, 9, 11, 11, 30),
    })),
  });
  await openClosedPanel(page);
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await expectPanelTimes(page.locator(".closed-item-heading"));
    await expect(page.locator(".closed-item-heading strong").last()).toHaveCSS("text-overflow", "ellipsis");
  }
});