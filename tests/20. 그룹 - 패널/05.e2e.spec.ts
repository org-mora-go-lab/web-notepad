import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { createGroup, groupsCommand } from "../__util__";

test("5. 모바일 그룹 이름은 왼쪽 16px 여백에서 시작해 두 줄까지 줄바꿈한 뒤 말줄임으로 표시한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await groupsCommand(page).click();
  const name = "Very long group name for desktop and mobile line clamp check";
  await createGroup(page, name);
  const groupName = page.locator(".group-status-name");
  await expect(groupName).toBeVisible();
  await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
  await expect(groupName).toHaveCSS("overflow", "hidden");
  await expect(groupName).toHaveCSS("-webkit-line-clamp", "2");
  await expect(groupName).toHaveCSS("white-space", "normal");
  const lineHeight = parseFloat(await groupName.evaluate((element) => getComputedStyle(element).lineHeight));
  expect((await groupName.boundingBox())!.height).toBeCloseTo(lineHeight * 2, 0);
  expect(await groupName.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  const groupCommandBounds = (await groupsCommand(page).boundingBox())!;
  expect((await groupName.boundingBox())!.x).toBeCloseTo(groupCommandBounds.x + 16, 0);
});
