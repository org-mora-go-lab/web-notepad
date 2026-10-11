import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { createGroupFixture, createTabFixture } from "../__fixture__";
import { bookmarksCommand, chooseTabMenuItem, seedStoredStateOnLoad } from "../__util__";

test("1. PC와 모바일에서 BOOKMARK 라벨과 아이콘 우측 상단 개수를 표시한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".bookmark-command .status-count, .closed-command .status-count")).toHaveCount(0);
  await chooseTabMenuItem(page, "Bookmark");
  const label = bookmarksCommand(page).locator(".status-label");
  const count = bookmarksCommand(page).locator(".status-count");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(label).toHaveText("BOOKMARK");
  await expect(label).toBeInViewport();
  await expect(count).toHaveText("1");
  await expect(count).toBeInViewport();

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(label).toBeVisible();
  await expect(count).toHaveText("1");
  await expect(count).toBeInViewport();
  await expect(bookmarksCommand(page).locator("svg")).toBeInViewport();
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    for (const command of [bookmarksCommand(page)]) {
      const iconBounds = (await command.locator("svg").boundingBox())!;
      const badgeBounds = (await command.locator(".status-count").boundingBox())!;
      const labelBounds = (await command.locator(".status-label").boundingBox())!;
      expect(badgeBounds.x).toBeGreaterThan(iconBounds.x + iconBounds.width / 2);
      expect(badgeBounds.x - iconBounds.x).toBeCloseTo(23, 1);
      expect(badgeBounds.y).toBeLessThan(iconBounds.y);
      if (viewport.width > 640) {
        expect(badgeBounds.x + badgeBounds.width).toBeLessThanOrEqual(labelBounds.x);
      } else {
        expect(badgeBounds.y + badgeBounds.height).toBeLessThanOrEqual(labelBounds.y);
      }
    }
  }

  const tabs = Array.from({ length: 14 }, (_, index) =>
    createTabFixture(`tab-${index}`, `Note ${index}`),
  );
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [createGroupFixture("ungrouped", "Ungrouped", tabs, {
      bookmarks: tabs.map((tab, index) => ({
        id: `bookmark-${index}`,
        sourceTabId: tab.id,
        title: tab.title,
        content: tab.content,
        tabColor: tab.tabColor,
        selectedLines: [],
        createdAt: index,
      })),
    })],
  });
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    for (const command of [bookmarksCommand(page)]) {
      const badge = command.locator(".status-count");
      await expect(badge).toHaveText("14");
      await expect(badge).toBeInViewport();
      const badgeBounds = (await badge.boundingBox())!;
      const labelBounds = (await command.locator(".status-label").boundingBox())!;
      if (viewport.width > 640) {
        expect(badgeBounds.x + badgeBounds.width).toBeLessThanOrEqual(labelBounds.x);
      } else {
        expect(badgeBounds.y + badgeBounds.height).toBeLessThanOrEqual(labelBounds.y);
      }
    }
  }
});
