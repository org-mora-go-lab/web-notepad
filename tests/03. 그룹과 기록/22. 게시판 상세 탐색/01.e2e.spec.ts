path_helper: node.save: Permission denied
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
    const listBack = page.locator(".board-page-header > a");
    const heading = page.getByRole("heading", { name: "Shared groups" });
    const listHeadingBounds = (await heading.boundingBox())!;
    const listContentBounds = (await page
      .locator(".board-content")
      .boundingBox())!;
    expect(listHeadingBounds.x + listHeadingBounds.width).toBeCloseTo(
      listContentBounds.x + listContentBounds.width,
      1,
    );
    await expect(listBack.locator(".lucide-chevron-left")).toHaveCount(1);
    const listBackground = await listBack.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    const listFontSize = await listBack.evaluate(
      (element) => getComputedStyle(element).fontSize,
    );
    const listBounds = (await listBack.boundingBox())!;
    const listBar = (await page.locator(".fixed-page-header").boundingBox())!;
    expect(
      await page
        .locator(".fixed-page-header")
        .evaluate((element) => getComputedStyle(element).position),
    ).toBe("fixed");
    expect(listBar.width).toBeCloseTo(width, 0);
    await page.locator(".board-page").evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await expect
      .poll(async () => (await listBack.boundingBox())?.y)
      .toBeCloseTo(listBounds.y, 1);
    await expect
      .poll(async () => (await heading.boundingBox())?.y)
      .toBeCloseTo(listHeadingBounds.y, 1);
    await page.locator(".board-page").evaluate((element) => {
      element.scrollTop = 0;
    });
    await listBack.hover();
    expect(
      await listBack.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    ).not.toBe(listBackground);
    await selectBoardPost(page, boardPost.title, boardPost.id);
    const detailBack = page.locator(".board-back");
    await expect(detailBack.locator(".lucide-chevron-left")).toHaveCount(1);
    const detailBackground = await detailBack.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    const detailBounds = (await detailBack.boundingBox())!;
    const detailHeading = page.locator(".fixed-page-header h1");
    await expect(detailHeading).toHaveText(boardPost.groupName);
    const detailHeadingBounds = (await detailHeading.boundingBox())!;
    const detailContentBounds = (await page
      .locator(".board-content")
      .boundingBox())!;
    expect(detailHeadingBounds.x + detailHeadingBounds.width).toBeCloseTo(
      detailContentBounds.x + detailContentBounds.width,
      1,
    );
    expect(detailHeadingBounds.y).toBeCloseTo(listHeadingBounds.y, 1);
    const detailBar = (await page.locator(".fixed-page-header").boundingBox())!;
    await expect(detailBack).toHaveCSS("font-size", listFontSize);
    expect(detailBounds.y).toBeCloseTo(listBounds.y, 1);
    expect(detailBounds.height).toBeCloseTo(listBounds.height, 1);
    expect(detailBar.width).toBeCloseTo(listBar.width, 0);
    expect(detailBar.height).toBeCloseTo(listBar.height, 0);
    await page.locator(".board-page").evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await expect
      .poll(async () => (await detailBack.boundingBox())?.y)
      .toBeCloseTo(detailBounds.y, 1);
    await expect
      .poll(async () => (await detailHeading.boundingBox())?.y)
      .toBeCloseTo(detailHeadingBounds.y, 1);
    await detailBack.hover();
    expect(
      await detailBack.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    ).not.toBe(detailBackground);
    await expect
      .poll(() => new URL(page.url()).searchParams.get("post"))
      .toBe(boardPost.id);

    await page.goBack();

    await expect(page).toHaveURL(/\/board$/);
    await expect(page.locator(".board-list")).toBeVisible();
    await expect(page.locator(".board-detail")).toHaveCount(0);
  }
});
