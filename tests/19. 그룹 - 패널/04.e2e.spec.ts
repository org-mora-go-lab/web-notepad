import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { createGroup, groupsCommand } from "../__util__";

test("4. PC 그룹명은 최대 351px 한 줄, 모바일은 두 줄까지 표시한 뒤 말줄임과 툴팁을 사용한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const name = "Very long group name for desktop and mobile line clamp check";
  await createGroup(page, name);
  const groupName = page.locator(".group-status-name");
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    await expect(groupName).toBeVisible();
    await expect(groupName).toHaveText(name);
    await expect(groupName).toHaveAttribute("title", name);
    await expect(groupsCommand(page)).toHaveAttribute("aria-label", `그룹 선택: ${name}`);
    await expect(groupsCommand(page).locator("svg")).toHaveCount(0);
    await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
    await expect(groupName).toHaveCSS("overflow", "hidden");
    if (viewport.width > 640) {
      await expect(groupName).toHaveCSS("white-space", "nowrap");
      await expect(groupName).toHaveCSS("max-width", "351px");
      expect((await groupName.boundingBox())!.width).toBe(351);
      expect(await groupName.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    } else {
      await expect(groupName).toHaveCSS("-webkit-line-clamp", "2");
      await expect(groupName).toHaveCSS("white-space", "normal");
      const lineHeight = parseFloat(await groupName.evaluate((element) => getComputedStyle(element).lineHeight));
      expect((await groupName.boundingBox())!.height).toBeCloseTo(lineHeight * 2, 0);
      expect(await groupName.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
      const groupCommandBounds = (await groupsCommand(page).boundingBox())!;
      expect((await groupName.boundingBox())!.x).toBeCloseTo(groupCommandBounds.x + 16, 0);
    }
  }
});
