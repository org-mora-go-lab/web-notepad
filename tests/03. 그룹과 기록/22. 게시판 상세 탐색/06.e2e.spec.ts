import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("6. 스크롤한 보드 목록에서 상세화면을 열면 항상 최상단에서 시작한다", async ({
  page,
  boardPost,
}) => {
  await page.setViewportSize({ width: 1280, height: 300 });
  await openBoard(page);
  const boardPage = page.locator(".board-page");
  const group = page.locator(`.board-entry[data-group-id="${boardPost.id}"]`);
  await group.scrollIntoViewIfNeeded();
  await boardPage.evaluate((element) => {
    element.scrollTop = Math.max(120, element.scrollHeight);
  });
  expect(
    await boardPage.evaluate((element) => element.scrollTop),
  ).toBeGreaterThan(0);

  await group.click();

  await expect(page.locator(".board-detail")).toBeVisible();
  await expect
    .poll(() => boardPage.evaluate((element) => element.scrollTop))
    .toBe(0);
  await expect(page.locator(".fixed-page-header h1")).toHaveText(
    boardPost.groupName,
  );
});
