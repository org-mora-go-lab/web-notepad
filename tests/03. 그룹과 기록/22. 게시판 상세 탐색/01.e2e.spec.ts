import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("1. 브라우저와 갤럭시 크기 모바일의 뒤로가기는 게시판 상세에서 목록으로 돌아온다", async ({
  page,
  boardPost,
}) => {
  for (const width of [1280, 360]) {
    await page.setViewportSize({ width, height: 800 });
    await openBoard(page);
    await selectBoardPost(page, boardPost.title, boardPost.id);
    await expect
      .poll(() => new URL(page.url()).searchParams.get("post"))
      .toBe(boardPost.id);

    await page.goBack();

    await expect(page).toHaveURL(/\/board$/);
    await expect(page.locator(".board-list")).toBeVisible();
    await expect(page.locator(".board-detail")).toHaveCount(0);
  }
});
