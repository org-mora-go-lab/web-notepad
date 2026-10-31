import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test.use({
  isMobile: true,
  hasTouch: true,
  viewport: { width: 390, height: 844 },
});

test("3. 모바일 보드 상세 푸터 제스처는 탭을 바꾸지 않고 첫 탭이 즉시 동작한다", async ({
  page,
  boardPost,
}) => {
  await openBoard(page);
  await selectBoardPost(page, boardPost.title, boardPost.id);
  const footer = page.locator(".board-mobile-footer .footer");
  const dashboard = page.locator(".board-mobile-footer .dashboard-command");
  const activeTab = page.getByRole("tab", { selected: true });
  await expect(page.locator(".board-note-preview")).toBeVisible();
  const activeTabName = await activeTab.textContent();
  await expect(footer).toBeVisible();
  await expect(dashboard).toBeVisible();
  const dashboardBounds = (await dashboard.boundingBox())!;
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
  await expect(page.getByRole("tab", { selected: true })).toHaveText(
    activeTabName ?? "",
  );
  // Use the same native touch input path as the swipe so the follow-up tap is
  // verified as a separate physical gesture rather than a synthetic click.
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      {
        x: dashboardBounds.x + dashboardBounds.width / 2,
        y: footerY,
      },
    ],
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
