import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test.use({
  isMobile: true,
  hasTouch: true,
  viewport: { width: 390, height: 844 },
});

test("7. 모바일 푸터를 좌우로 스와이프하면 에디터 탭을 순환 전환한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "First note"),
        createTabFixture("tab-2", "Second note"),
        createTabFixture("tab-3", "Third note"),
      ]),
    ],
  });
  const footer = page.locator(".footer");
  await expect(footer.locator(".auth-command:not(.is-loading)")).toBeVisible();
  const session = await page.context().newCDPSession(page);
  const swipe = async (fromX: number, toX: number, verticalOffset = 0) => {
    const bounds = (await footer.boundingBox())!;
    const startY = bounds.y + bounds.height / 2;
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: bounds.x + bounds.width * fromX, y: startY }],
    });
    await page.waitForTimeout(50);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        {
          x: bounds.x + bounds.width * toX,
          y: startY + verticalOffset,
        },
      ],
    });
    await page.waitForTimeout(50);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  };

  await expect(page.locator("textarea")).toHaveValue("First note");
  await swipe(0.8, 0.2);
  await expect(page.locator("textarea")).toHaveValue("Second note");
  await expect(page.locator(".body")).toHaveClass(/is-slide-left/);
  await swipe(0.2, 0.8);
  await expect(page.locator("textarea")).toHaveValue("First note");
  await expect(page.locator(".body")).toHaveClass(/is-slide-right/);
  await swipe(0.2, 0.8);
  await expect(page.locator("textarea")).toHaveValue("Third note");
  await swipe(0.5, 0.58);
  await expect(page.locator("textarea")).toHaveValue("Third note");
  await swipe(0.65, 0.35, 180);
  await expect(page.locator("textarea")).toHaveValue("Third note");
  await session.detach();
});
