path_helper: node.save: Permission denied
import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("2. 공유 그룹 보드 상세의 글자를 2px 키운다", async ({
  page,
  boardPost,
}) => {
  await page.goto("/");
  await openBoard(page);
  await selectBoardPost(page, boardPost.title);
  const fontScale = await page.evaluate(() =>
    Number(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--font-scale",
      ),
    ),
  );

  for (const [selector, size] of [
    [".board-back", 17],
    [".board-group-name", 15],
    [".board-owner", 17],
    [".board-detail h3", 27],
    [".board-meta", 15],
    [".board-description", 18],
    [".board-join-hint", 14],
    [".board-detail-actions .board-primary", 15],
    [".board-detail-actions .board-copy", 15],
  ] as const) {
    const actual = await page
      .locator(selector)
      .first()
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    expect(actual).toBeCloseTo(size * fontScale, 1);
  }
});
