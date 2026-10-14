import { expect, test } from "@playwright/test";

import { seedSplitState } from "../__util__";

test("1. 탭 제목을 다른 패널의 편집기 영역에 드롭해 이동한다", async ({ page }) => {
  await seedSplitState(page);
  const leftPane = page.locator(".pane-slot").nth(0);
  const rightPane = page.locator(".pane-slot").nth(1);
  const paneTab = (pane: typeof leftPane, title: RegExp) =>
    pane.locator(".tab-item").filter({ hasText: title });
  await expect(page.locator(".body")).toHaveCount(2);
  await expect(leftPane.locator("textarea")).toHaveValue("left");
  await expect(rightPane.locator("textarea")).toHaveValue("right");

  await leftPane.getByRole("button", { name: "New tab" }).click();
  await leftPane.locator("textarea").fill("extra");
  await expect(leftPane.locator(".tab-item")).toHaveCount(2);

  const rightBody = rightPane.locator(".body");
  const rightBox = (await rightBody.boundingBox())!;
  await paneTab(leftPane, /^left$/i).locator(".tab-title").dragTo(rightBody, {
    targetPosition: { x: rightBox.width * 0.25, y: rightBox.height * 0.25 },
  });
  await expect(leftPane.locator(".tab-item")).toHaveCount(1);
  await expect(paneTab(leftPane, /^extra$/)).toHaveCount(1);
  await expect(rightPane.locator(".tab-item")).toHaveCount(2);
  await expect(paneTab(rightPane, /^left$/i)).toHaveCount(1);
  await expect(paneTab(rightPane, /^right$/i)).toHaveCount(1);

});
