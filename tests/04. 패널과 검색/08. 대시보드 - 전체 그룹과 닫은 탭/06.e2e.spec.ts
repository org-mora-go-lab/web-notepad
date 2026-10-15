import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardPanel } from "../__util__";

test("6. 고정·북마크된 탭의 카드는 우측 상단에 핀·북마크 아이콘을 가로로 나란히 표시한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [createGroupFixture("ungrouped", "Ungrouped", [
      createTabFixture("tab-1", "Marked task", { bookmarked: true }),
      createTabFixture("tab-2", "Pinned task", { pinned: true }),
      createTabFixture("tab-3", "Both task", { pinned: true, bookmarked: true }),
      createTabFixture("tab-4", "Plain task"),
    ])],
    nextTabNumber: 5,
  });
  await openPanel(page, "dashboard-panel");
  const card = (title: string) => dashboardPanel(page).locator(".dashboard-card").filter({ hasText: title });
  const pin = (title: string) => card(title).locator(".dashboard-card-pin");
  const bookmark = (title: string) => card(title).locator(".dashboard-card-bookmark");

  await expect(bookmark("Marked task")).toBeVisible();
  await expect(bookmark("Marked task").locator("svg")).toHaveCSS("fill", "none");
  await expect(pin("Marked task")).toHaveCount(0);
  await expect(pin("Pinned task")).toBeVisible();
  await expect(bookmark("Pinned task")).toHaveCount(0);
  await expect(card("Plain task").locator(".dashboard-card-indicators")).toHaveCount(0);

  const cardBox = (await card("Both task").boundingBox())!;
  const pinBox = (await pin("Both task").boundingBox())!;
  const bookmarkBox = (await bookmark("Both task").boundingBox())!;
  expect(bookmarkBox.x + bookmarkBox.width).toBeGreaterThan(cardBox.x + cardBox.width - 20);
  expect(pinBox.y).toBeLessThan(cardBox.y + 16);
  expect(bookmarkBox.x).toBeGreaterThanOrEqual(pinBox.x + pinBox.width);
  expect(bookmarkBox.y).toBeCloseTo(pinBox.y, 0);
});
