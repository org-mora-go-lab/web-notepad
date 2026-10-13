import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";

test("8. PC는 BOOKMARK·DASHBOARD를 왼쪽에, 그룹 선택 버튼을 오른쪽에 배치한다", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize(DESKTOP_VIEWPORT);
  const commands = page.locator(".status-meta .status-command:visible");
  await expect(commands).toHaveCount(3);
  await expect(commands.first()).toHaveClass(/bookmark-command/);
  await expect(commands.nth(1)).toHaveClass(/dashboard-command/);
  await expect(commands.last()).toHaveClass(/group-select-command/);
  const boxes = await Promise.all((await commands.all()).map((command) => command.boundingBox()));
  expect(boxes[0]!.x).toBe(16);
  expect(boxes[1]!.x).toBeGreaterThan(boxes[0]!.x + boxes[0]!.width);
  expect(boxes[2]!.x + boxes[2]!.width).toBeCloseTo(DESKTOP_VIEWPORT.width - 26, 1);
});
