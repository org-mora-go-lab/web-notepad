import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test.use({
  isMobile: true,
  hasTouch: true,
  viewport: { width: 390, height: 844 },
});

test("8. 푸터 스와이프 직후 같은 아이콘도 첫 탭으로 열고 다음 탭으로 닫는다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "First note"),
        createTabFixture("tab-2", "Second note"),
      ]),
    ],
  });
  const footer = page.locator(".footer");
  const dashboard = footer.locator(".dashboard-command");
  await expect(footer.locator(".auth-command:not(.is-loading)")).toBeVisible();
  const dashboardBounds = (await dashboard.boundingBox())!;
  const footerBounds = (await footer.boundingBox())!;
  const footerY = dashboardBounds.y + dashboardBounds.height / 2;
  const session = await page.context().newCDPSession(page);

  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      { x: dashboardBounds.x + dashboardBounds.width / 2, y: footerY },
    ],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: footerBounds.x + footerBounds.width * 0.2, y: footerY }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator("textarea")).toHaveValue("Second note");
  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "true",
  );

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

  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
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
  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await session.detach();
});
