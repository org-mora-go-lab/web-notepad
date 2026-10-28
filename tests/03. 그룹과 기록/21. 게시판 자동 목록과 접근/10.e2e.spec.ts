import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("10. 공유 그룹 보드 목록의 글자를 2px 키운다", async ({
  page,
  boardPost,
}) => {
  await page.goto("/");
  await openBoard(page);
  const fontScale = await page.evaluate(() =>
    Number(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--font-scale",
      ),
    ),
  );

  for (const [selector, size] of [
    [".board-page-header > a", 16],
    [".board-page-header h1", 34],
    [".board-eyebrow", 13],
    [".board-intro p", 15],
    [".board .search-field input", 16],
    [".board-table", 15],
    [`.board-entry[data-group-id="${boardPost.id}"]`, 15],
    [".board-owner", 15],
  ] as const) {
    const actual = await page
      .locator(selector)
      .first()
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    expect(actual).toBeCloseTo(size * fontScale, 1);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileSearchSize = await page
    .locator(".board .search-field input")
    .evaluate((input) => parseFloat(getComputedStyle(input).fontSize));
  expect(mobileSearchSize).toBeCloseTo(18.8 * fontScale, 1);
});
