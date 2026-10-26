import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("9. 목록으로 돌아가기 화살표와 문구는 PC와 모바일 모두 한 줄이다", async ({ page, boardPost }) => {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 800 }); await page.goto("/"); await openBoard(page); await selectBoardPost(page, boardPost.title);
    const back = page.locator(".board-back"), icon = (await back.locator("svg").boundingBox())!, text = (await back.locator("span").boundingBox())!;
    expect(icon.x + icon.width).toBeLessThanOrEqual(text.x);
    expect(icon.y + icon.height / 2).toBeCloseTo(text.y + text.height / 2, 0);
    await back.click(); await expect(page.locator(".board-list")).toBeVisible();
  }
});
