import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("10. PC 보드 목록·상세·My Page에서 공통 푸터를 하단에 고정한다", async ({
  page,
  boardPost,
}) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  const expectFixedFooter = async (pageSelector: string) => {
    const footer = page.locator(".footer");
    const main = page.locator(pageSelector);
    await expect(footer).toBeVisible();
    await expect(footer).toHaveCSS("position", "fixed");
    const footerBox = (await footer.boundingBox())!;
    expect(footerBox.y + footerBox.height).toBeCloseTo(844, 0);
    const bottomPadding = await main.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingBottom),
    );
    expect(bottomPadding).toBeGreaterThanOrEqual(footerBox.height);
  };

  await openBoard(page);
  await expectFixedFooter(".board-page");

  await selectBoardPost(page, boardPost.title, boardPost.id);
  await expectFixedFooter(".board-page");

  await page.goto("/my-page");
  await expect(page.locator(".my-page")).toBeVisible();
  await expectFixedFooter(".my-page");
});
