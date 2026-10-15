import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { createGroup, groupsCommand, groupStatusName } from "../../__util__";

test("4. 긴 그룹 이름은 전체 이름을 툴팁과 접근성 라벨로 제공한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const name = "Very long group name for desktop and mobile line clamp check";
  await createGroup(page, name);
  const groupName = groupStatusName(page);
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    await expect(groupName).toHaveAttribute("title", name);
    await expect(groupsCommand(page)).toHaveAttribute("aria-label", `Select group: ${name}`);
  }
});
