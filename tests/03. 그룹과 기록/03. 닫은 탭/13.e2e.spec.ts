import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../../__fixture__";
import { openClosedPanel, seedStoredStateOnLoad } from "../../__util__";

test.use({ timezoneId: "UTC" });

test("13. 닫은 시각은 그룹명 길이와 무관하게 고정된 우측 영역(높이 PC 32px·모바일 38px)에 표시하고 긴 그룹명은 말줄임 처리한다", async ({ page }) => {
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
  const headings = page.locator(".closed-item-heading");
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator("#closed-panel")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    await expect(headings.locator("time")).toHaveCount(2);
    const bounds = [];
    for (const heading of await headings.all()) {
      const time = heading.locator("time");
      await expect(time).toHaveCSS("flex-shrink", "0");
      await expect(time).toHaveCSS("height", width <= 640 ? "38px" : "32px");
      const timeBounds = (await time.boundingBox())!;
      const titleBounds = (await heading.locator("strong").boundingBox())!;
      expect(titleBounds.x + titleBounds.width).toBeLessThanOrEqual(timeBounds.x);
      const headingBounds = (await heading.boundingBox())!;
      expect(timeBounds.x + timeBounds.width).toBeCloseTo(headingBounds.x + headingBounds.width, 1);
      bounds.push(timeBounds);
    }
    expect(bounds[0].x).toBeCloseTo(bounds[1].x, 1);
    expect(bounds[0].width).toBeCloseTo(bounds[1].width, 1);
    await expect(page.locator(".closed-item-heading strong").last()).toHaveCSS("text-overflow", "ellipsis");
  }
});
