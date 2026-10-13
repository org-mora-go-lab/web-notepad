import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("9. 모바일은 BOOKMARK를 왼쪽 21px, 그룹 선택 버튼을 오른쪽 21px에 배치하고 그룹 이름을 한 줄로 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize(MOBILE_VIEWPORT);
  const commands = page.locator(".status-meta .status-command:visible");
  await expect(commands).toHaveCount(2);
  const boxes = await Promise.all((await commands.all()).map((command) => command.boundingBox()));
  expect(boxes[0]!.x).toBeCloseTo(21, 1);
  expect(boxes[1]!.x + boxes[1]!.width).toBeCloseTo(MOBILE_VIEWPORT.width - 21, 1);
  await expect(page.locator(".group-select-name")).toHaveCSS("white-space", "nowrap");
});
