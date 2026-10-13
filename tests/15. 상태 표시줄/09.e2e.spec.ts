import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("9. 모바일은 그룹 선택 버튼을 왼쪽 21px부터, BOOKMARK·DASHBOARD를 오른쪽 21px에 배치하고 그룹 이름을 한 줄로 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(page.locator(".status-meta .status-command:visible")).toHaveCount(3);
  const [bookmark, dashboard, group] = await Promise.all(
    ["bookmark-command", "dashboard-command", "group-select-command"].map((name) =>
      page.locator(`.status-meta .${name}`).boundingBox(),
    ),
  );
  expect(group!.x).toBeCloseTo(21, 1);
  expect(bookmark!.x).toBeGreaterThan(group!.x + group!.width);
  expect(dashboard!.x).toBeGreaterThan(bookmark!.x + bookmark!.width);
  expect(dashboard!.x + dashboard!.width).toBeCloseTo(MOBILE_VIEWPORT.width - 21, 1);
  await expect(page.locator(".group-select-name")).toHaveCSS("white-space", "nowrap");
});
