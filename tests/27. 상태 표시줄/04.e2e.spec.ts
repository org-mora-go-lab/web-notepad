import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("4. 그룹명·SEARCH·BOOKMARK·그룹 아이콘 순서로 PC는 좌우 묶음, 모바일은 남은 너비와 72px 열로 배치한다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".status-light, .save-state")).toHaveCount(0);
  const classes = ["group-status-command", "global-search-command", "bookmark-command", "group-select-command"];
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const commands = page.locator(".status-meta .status-command:visible");
    await expect(commands).toHaveCount(classes.length);
    for (const [index, command] of (await commands.all()).entries()) {
      await expect(command).toHaveClass(new RegExp(classes[index]));
    }
    const boxes = await Promise.all((await commands.all()).map((command) => command.boundingBox()));
    if (viewport.width <= 640) {
      expect(boxes[0]!.x).toBe(0);
      expect(boxes[0]!.width).toBeCloseTo(viewport.width - 72 * 3, 1);
      for (const [index, box] of boxes.slice(1).entries()) {
        expect(box!.width).toBeCloseTo(72, 1);
        expect(box!.x).toBeCloseTo(viewport.width - 72 * (3 - index), 1);
      }
    } else {
      expect(boxes[0]!.x).toBe(16);
      expect(boxes[1]!.x - boxes[0]!.x - boxes[0]!.width).toBeGreaterThan(20);
      expect(boxes[2]!.x - boxes[1]!.x - boxes[1]!.width).toBeCloseTo(20, 1);
      expect(boxes[3]!.x - boxes[2]!.x - boxes[2]!.width).toBeCloseTo(20, 1);
      expect(boxes[3]!.x + boxes[3]!.width).toBeCloseTo(viewport.width - 26, 1);
    }
  }
});
