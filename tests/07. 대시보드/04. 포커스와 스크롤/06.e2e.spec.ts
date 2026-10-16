import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardColumn, dashboardPanel, openPanel, writeStoredState } from "../../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("6. 모바일 상태 제목은 자신의 세로선 끝까지 이동한 뒤 다음 상태로 고정을 넘긴다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [createGroupFixture("ungrouped", "Ungrouped", Array.from(
      { length: 20 },
      (_, index) => createTabFixture(`tab-${index}`, `Done task ${index}\nBody`, { tabColor: "purple" }),
    ))],
  });
  await openPanel(page, "dashboard-panel");
  const panel = dashboardPanel(page);
  const list = panel.locator(".dashboard-list");
  const todo = dashboardColumn(page, "todo");
  const title = todo.locator(".dashboard-column-status");
  const doingTitle = dashboardColumn(page, "in-progress").locator(".dashboard-column-status");
  const headerBox = (await panel.locator(".side-panel-header").boundingBox())!;
  const stickyTop = headerBox.y + headerBox.height + 20;
  const titleHeight = (await title.boundingBox())!.height;
  const columnBox = (await todo.boundingBox())!;

  // Move the end of Todo halfway through the sticky title's height.
  await list.evaluate((element, offset) => { element.scrollTop = offset; },
    columnBox.y + columnBox.height - stickyTop - titleHeight / 2);
  await expect.poll(async () => {
    const box = (await todo.boundingBox())!;
    const titleBox = (await title.boundingBox())!;
    return titleBox.y + titleBox.height - (box.y + box.height);
  }).toBeCloseTo(0, 0);

  await doingTitle.evaluate((element) => element.scrollIntoView({ block: "start" }));
  expect((await doingTitle.boundingBox())!.y).toBeCloseTo(stickyTop, 0);
  const oldTitleBox = (await title.boundingBox())!;
  expect(oldTitleBox.y + oldTitleBox.height).toBeLessThanOrEqual(stickyTop);
});
