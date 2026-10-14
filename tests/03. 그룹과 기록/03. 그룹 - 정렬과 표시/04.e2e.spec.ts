import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { createGroup, groupsCommand, groupStatusName } from "../../__util__";

test("4. 모바일 그룹 이름은 우측 그룹 선택 버튼의 아이콘 오른쪽에 한 줄 말줄임으로 표시한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await groupsCommand(page).click();
  const name = "Very long group name for desktop and mobile line clamp check";
  await createGroup(page, name);
  const groupName = groupStatusName(page);
  await expect(groupName).toBeVisible();
  await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
  await expect(groupName).toHaveCSS("overflow", "hidden");
  await expect(groupName).toHaveCSS("white-space", "nowrap");
  expect(await groupName.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  const icon = (await groupsCommand(page).locator("svg").boundingBox())!;
  const nameBounds = (await groupName.boundingBox())!;
  expect(nameBounds.x).toBeGreaterThanOrEqual(icon.x + icon.width);
  expect(nameBounds.x + nameBounds.width).toBeLessThanOrEqual(MOBILE_VIEWPORT.width - 21 + 1);
});
