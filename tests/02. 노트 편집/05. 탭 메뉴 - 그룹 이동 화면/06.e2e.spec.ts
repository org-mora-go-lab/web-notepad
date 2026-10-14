import { expect, type Locator, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState, writeStoredState } from "../../__util__";

test("6. 기본 탭 메뉴와 그룹 목록을 PC와 모바일 화면 안에 배치한다", async ({ page }) => {
  const longName = "Very long target group name that should be truncated in the menu";
  const menu = page.getByRole("menu", { name: "Move Group", exact: true });
  const expectInViewport = async (locator: Locator, width: number, height: number) => {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(8);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width - 8);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(height - 8);
  };

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const state = await seedMoveGroupState(page);
    state.groups[1].name = longName;
    await writeStoredState(page, state);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await expectInViewport(
      page.getByRole("menu", { name: "Tab actions", exact: true }),
      viewport.width,
      viewport.height,
    );
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await expectInViewport(menu, viewport.width, viewport.height);
  }
});
