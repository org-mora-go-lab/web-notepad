import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test.use({
  isMobile: true,
  hasTouch: true,
  viewport: { width: 390, height: 844 },
});

test("3. 모바일 보드 상세 푸터 스와이프 직후 첫 푸터 탭이 즉시 동작한다", async ({
  page,
  boardPost,
}) => {
  await openBoard(page);
  await selectBoardPost(page, boardPost.title, boardPost.id);
  const footer = page.locator(".board-mobile-footer .footer");
  const dashboard = page.locator(".board-mobile-footer .dashboard-command");
  await expect(page.locator(".board-note-preview")).toBeVisible();
  await expect(footer).toBeVisible();
  await expect(dashboard).toBeVisible();
  const footerBounds = (await footer.boundingBox())!;
  const footerY = footerBounds.y + footerBounds.height / 2;
  const session = await page.context().newCDPSession(page);

  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: footerBounds.x + footerBounds.width * 0.8, y: footerY }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: footerBounds.x + footerBounds.width * 0.2, y: footerY }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  // This is the first real tap after the swipe. Playwright's tap action keeps
  // the touch sequence realistic without inserting an artificial wait.
  await dashboard.tap();

  await expect(page).toHaveURL(/[?&]panel=dashboard(?:&|$)/);
  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await session.detach();
});
