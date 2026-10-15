import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("5. 그룹 드롭다운 너비를 기존보다 15% 확대하고 화면 여백 안으로 제한한다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await expect(groupMenu(page)).toHaveCSS("width", "322px");

  await page.setViewportSize({ width: 640, height: 800 });
  expect((await groupMenu(page).boundingBox())!.width).toBeCloseTo(386.4, 1);

  await page.setViewportSize({ width: 360, height: 800 });
  await expect(groupMenu(page)).toHaveCSS("width", "344px");
});
