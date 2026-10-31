import { expect, type Locator, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test.use({
  isMobile: true,
  hasTouch: true,
  viewport: { width: 390, height: 844 },
});

test("7. 모바일 푸터에서만 스와이프로 탭을 전환하고 에디터 포커스를 유지하지 않는다", async ({
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
  const swipeTarget = async (
    target: Locator,
    fromX: number,
    toX: number,
    verticalOffset = 0,
  ) => {
    const bounds = (await target.boundingBox())!;
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
  const swipe = (fromX: number, toX: number, verticalOffset = 0) =>
    swipeTarget(footer, fromX, toX, verticalOffset);

  const editor = page.locator("textarea");
  await expect(editor).toHaveValue("First note");
  await editor.blur();
  await swipe(0.8, 0.2);
  await expect(editor).toHaveValue("Second note");
  await expect(editor).not.toBeFocused();
  await expect(page.locator(".body")).toHaveClass(/is-slide-left/);
  await page.locator(".dashboard-command").click();
  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await swipe(0.8, 0.2);
  await expect(editor).toHaveValue("Second note");
  await page.locator(".dashboard-command").click();
  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  const editorBody = page.locator(".body");
  await swipeTarget(editorBody, 0.8, 0.2);
  await expect(editor).toHaveValue("Second note");
  await swipeTarget(editorBody, 0.2, 0.8);
  await expect(editor).toHaveValue("Second note");
  await swipe(0.2, 0.8);
  await expect(editor).toHaveValue("First note");
  await expect(editor).not.toBeFocused();
  await expect(page.locator(".body")).toHaveClass(/is-slide-right/);
  await swipe(0.2, 0.8);
  await expect(editor).toHaveValue("Third note");
  await expect(editor).not.toBeFocused();
  await swipe(0.5, 0.58);
  await expect(editor).toHaveValue("Third note");
  await swipe(0.65, 0.35, 180);
  await expect(editor).toHaveValue("Third note");
  await session.detach();
});
