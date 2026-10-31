import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test.use({
  isMobile: true,
  hasTouch: true,
  viewport: { width: 390, height: 844 },
});

test("3. 모바일 보드 상세 스와이프 직후 첫 푸터 탭이 즉시 동작한다", async ({
  page,
  boardPost,
}) => {
  await openBoard(page);
  await selectBoardPost(page, boardPost.title, boardPost.id);
  const preview = page.locator(".board-note-preview");
  const dashboard = page.locator(".board-mobile-footer .dashboard-command");
  await expect(preview).toBeVisible();
  await expect(dashboard).toBeVisible();
  const previewBounds = (await preview.boundingBox())!;
  const dashboardBounds = (await dashboard.boundingBox())!;
  const previewY = previewBounds.y + Math.min(120, previewBounds.height / 2);
  const dashboardPoint = {
    x: dashboardBounds.x + dashboardBounds.width / 2,
    y: dashboardBounds.y + dashboardBounds.height / 2,
  };
  const session = await page.context().newCDPSession(page);

  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      { x: previewBounds.x + previewBounds.width * 0.8, y: previewY },
    ],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      { x: previewBounds.x + previewBounds.width * 0.2, y: previewY },
    ],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [dashboardPoint],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });

  await expect(page).toHaveURL(/[?&]panel=dashboard(?:&|$)/);
  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await session.detach();
});
