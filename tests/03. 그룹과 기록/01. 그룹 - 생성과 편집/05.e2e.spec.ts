import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("5. 그룹 드롭다운 기본 너비를 15% 축소하고 화면 여백 안으로 제한한다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  expect((await groupMenu(page).boundingBox())!.width).toBeCloseTo(273.7, 1);

  await page.setViewportSize({ width: 640, height: 800 });
  expect((await groupMenu(page).boundingBox())!.width).toBeCloseTo(328.44, 1);

  await page.setViewportSize({ width: 360, height: 800 });
  expect((await groupMenu(page).boundingBox())!.width).toBeCloseTo(328.44, 1);
});
