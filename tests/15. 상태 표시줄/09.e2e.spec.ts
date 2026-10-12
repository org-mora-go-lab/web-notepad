import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("9. 모바일은 그룹명이 남은 너비를 차지하고 나머지 명령을 72px 열로 배치한다", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize(MOBILE_VIEWPORT);
  const commands = page.locator(".status-meta .status-command:visible");
  await expect(commands).toHaveCount(3);
  const boxes = await Promise.all((await commands.all()).map((command) => command.boundingBox()));
  expect(boxes[0]!.x).toBe(0);
  expect(boxes[0]!.width).toBeCloseTo(MOBILE_VIEWPORT.width - 72 * 2, 1);
  for (const [index, box] of boxes.slice(1).entries()) {
    expect(box!.width).toBeCloseTo(72, 1);
    expect(box!.x).toBeCloseTo(MOBILE_VIEWPORT.width - 72 * (2 - index), 1);
  }
});
