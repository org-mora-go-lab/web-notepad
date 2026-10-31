import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test.use({
  isMobile: true,
  hasTouch: true,
  viewport: { width: 390, height: 844 },
});

test("8. 푸터 스와이프 직후 다른 아이콘의 첫 click 이벤트가 즉시 동작한다", async ({
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
  // This is a distinct click event on another icon. It must not be mistaken
  // for the compatibility click synthesized from the preceding swipe.
  await dashboard.dispatchEvent("click");

  await expect(page.locator("textarea")).toHaveValue("Second note");
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await session.detach();
});
