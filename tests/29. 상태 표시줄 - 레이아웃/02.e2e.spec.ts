import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";

test("2. PC는 그룹명을 왼쪽에, 나머지 명령을 오른쪽에 20px 간격으로 모아 배치한다", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize(DESKTOP_VIEWPORT);
  const commands = page.locator(".status-meta .status-command:visible");
  await expect(commands).toHaveCount(3);
  const boxes = await Promise.all((await commands.all()).map((command) => command.boundingBox()));
  expect(boxes[0]!.x).toBe(16);
  expect(boxes[1]!.x - boxes[0]!.x - boxes[0]!.width).toBeGreaterThan(20);
  expect(boxes[2]!.x - boxes[1]!.x - boxes[1]!.width).toBeCloseTo(20, 1);
  expect(boxes[2]!.x + boxes[2]!.width).toBeCloseTo(DESKTOP_VIEWPORT.width - 26, 1);
});
