import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { groupMenu, groupsCommand } from "../../__util__";

test("7. 모바일 그룹 사이드바는 기존 패널처럼 화면 전체를 덮는다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await groupsCommand(page).click();
  const menu = (await groupMenu(page).boundingBox())!;
  expect(menu.x).toBe(0);
  expect(menu.y).toBe(0);
  expect(menu.width).toBe(MOBILE_VIEWPORT.width);
  expect(menu.height).toBe(MOBILE_VIEWPORT.height);
});
