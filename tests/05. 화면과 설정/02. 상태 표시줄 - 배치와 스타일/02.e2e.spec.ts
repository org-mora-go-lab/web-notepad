import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";

test("2. PC는 그룹 선택 버튼을 왼쪽에, BOOKMARK·DASHBOARD를 오른쪽에 배치한다", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize(DESKTOP_VIEWPORT);
  const commands = page.locator(".status-meta .status-command:visible");
  await expect(commands).toHaveCount(3);
  const [bookmark, dashboard, group] = await Promise.all(
    ["bookmark-command", "dashboard-command", "group-select-command"].map((name) =>
      page.locator(`.status-meta .${name}`).boundingBox(),
    ),
  );
  expect(group!.x).toBe(16);
  expect(bookmark!.x).toBeGreaterThan(group!.x + group!.width);
  expect(dashboard!.x).toBeGreaterThan(bookmark!.x + bookmark!.width);
  expect(dashboard!.x + dashboard!.width).toBeCloseTo(DESKTOP_VIEWPORT.width - 26, 1);
});
