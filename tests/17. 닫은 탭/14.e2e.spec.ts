import { test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../__fixture__";
import { expectPanelTimes, openClosedPanel, seedStoredStateOnLoad } from "../__util__";

test.use({ timezoneId: "UTC" });

test("14. 닫은 시각은 YY. MM. DD와 hh:mm:ss AM/PM 영어 형식의 현지 시각을 줄바꿈 없이 두 줄로 표시한다", async ({ page }) => {
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
  }
});
