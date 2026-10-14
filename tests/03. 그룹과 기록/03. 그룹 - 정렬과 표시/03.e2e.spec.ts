import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { createGroup, groupsCommand, groupStatusName } from "../../__util__";

test("3. 현재 그룹 이름을 PC와 모바일 모두 우측 그룹 선택 버튼에 아이콘과 함께 표시하고 PC는 최대 351px 한 줄 말줄임으로 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const name = "Very long group name for desktop and mobile line clamp check";
  await createGroup(page, name);
  const groupName = groupStatusName(page);
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    await expect(groupName).toBeVisible();
    await expect(groupName).toHaveText(name);
    await expect(groupsCommand(page).locator("svg")).toHaveCount(1);
  }

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
  await expect(groupName).toHaveCSS("overflow", "hidden");
  await expect(groupName).toHaveCSS("white-space", "nowrap");
  await expect(groupName).toHaveCSS("max-width", "351px");
  expect((await groupName.boundingBox())!.width).toBe(351);
  expect(await groupName.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
});
