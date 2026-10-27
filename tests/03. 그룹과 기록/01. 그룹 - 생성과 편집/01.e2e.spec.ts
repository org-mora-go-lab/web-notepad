import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("1. 하단 GROUP 버튼은 작업공간 왼쪽에 그룹 사이드바를 연다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await expect(groupMenu(page)).toBeVisible();
  await expect(groupMenu(page).locator(".group-create-form")).toHaveCSS(
    "border-top-width",
    "0px",
  );
  const menuBox = (await groupMenu(page).boundingBox())!;
  const workspaceBox = (await page.locator(".workspace").boundingBox())!;
  expect(menuBox.x).toBe(0);
  expect(menuBox.height).toBe(await page.evaluate(() => innerHeight));
  expect(workspaceBox.x).toBeCloseTo(menuBox.width, 0);
});
