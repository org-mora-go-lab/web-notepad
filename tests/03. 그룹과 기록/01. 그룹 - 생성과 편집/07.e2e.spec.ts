import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { groupMenu, groupsCommand } from "../../__util__";

test("7. 모바일 그룹 드롭다운을 별도 그룹명 패널 바로 위에 배치한다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await groupsCommand(page).click();
  const menu = (await groupMenu(page).boundingBox())!;
  const groupNamePanel = (await page
    .locator(".current-group-panel")
    .boundingBox())!;

  expect(groupNamePanel.y - (menu.y + menu.height)).toBeCloseTo(4, 0);
});
