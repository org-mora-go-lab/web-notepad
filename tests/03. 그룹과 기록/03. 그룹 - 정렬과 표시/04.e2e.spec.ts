import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { createGroup, groupsCommand } from "../../__util__";

test("4. 모바일 현재 그룹 영역은 긴 이름 전체를 툴팁으로 제공한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const name = "Very long group name for desktop and mobile line clamp check";
  await createGroup(page, name);
  await page.setViewportSize(MOBILE_VIEWPORT);
  const groupName = page.locator(".current-group-name");
  await expect(groupName).toHaveAttribute("title", name);
  await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
  await expect(groupName).toHaveCSS("white-space", "nowrap");
});
