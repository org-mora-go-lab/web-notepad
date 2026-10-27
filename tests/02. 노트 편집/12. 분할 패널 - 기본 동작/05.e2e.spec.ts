import { expect, test } from "@playwright/test";

import { seedSplitState } from "../__util__";

test("5. 오른쪽 패널의 마지막 탭을 왼쪽으로 옮기면 분할 화면을 해제한다", async ({
  page,
}) => {
  await seedSplitState(page);
  const leftPane = page.locator('.pane-slot[data-pane="left"]');
  const rightPane = page.locator('.pane-slot[data-pane="right"]');
  await rightPane.locator(".tab-item").dragTo(leftPane.locator(".header"));
  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await expect(page.locator(".tab-title")).toHaveText([/^left$/i, /^right$/i]);
});
