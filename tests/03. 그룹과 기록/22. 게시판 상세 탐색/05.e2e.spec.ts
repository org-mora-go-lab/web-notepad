import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("5. 보드 상세 편집기 최하단의 스크롤을 다음 페이지 콘텐츠로 넘긴다", async ({
  page,
  boardPost,
}) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await openBoard(page);
  await selectBoardPost(page, boardPost.title, boardPost.id);
  await page
    .getByRole("tab", {
      name: "Overflow verification shared note with a deliberately long title",
    })
    .click();

  const preview = page.locator(".board-note-preview");
  const boardPage = page.locator(".board-page");
  await expect(preview).toHaveCSS("overscroll-behavior-y", "auto");
  expect(
    await preview.evaluate((element) => element.scrollHeight),
  ).toBeGreaterThan(await preview.evaluate((element) => element.clientHeight));
  await preview.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const pageScrollBefore = await boardPage.evaluate(
    (element) => element.scrollTop,
  );

  await preview.hover();
  await page.mouse.wheel(0, 500);

  await expect
    .poll(() => boardPage.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(pageScrollBefore);
});
