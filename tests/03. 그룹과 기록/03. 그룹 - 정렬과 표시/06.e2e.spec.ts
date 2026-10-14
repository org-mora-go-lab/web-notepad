import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { createGroup, groupsCommand, groupStatusName } from "../../__util__";

test("6. 긴 그룹 이름은 전체 이름 툴팁·접근성 라벨로 제공하고 다른 하단 라벨과 겹치지 않는다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const name = "Very long group name for desktop and mobile line clamp check";
  await createGroup(page, name);
  const groupName = groupStatusName(page);
  const otherLabels = page.locator(".footer .global-search-label, .footer .status-label:not(.group-select-name)");
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    await expect(groupName).toHaveAttribute("title", name);
    await expect(groupsCommand(page)).toHaveAttribute("aria-label", `그룹 선택: ${name}`);
    let checked = 0;
    const nameBox = (await groupName.boundingBox())!;
    for (const label of await otherLabels.all()) {
      if (!(await label.isVisible())) continue;
      const box = (await label.boundingBox())!;
      const overlaps =
        nameBox.x < box.x + box.width &&
        box.x < nameBox.x + nameBox.width &&
        nameBox.y < box.y + box.height &&
        box.y < nameBox.y + nameBox.height;
      expect(overlaps).toBe(false);
      checked += 1;
    }
    if (viewport === DESKTOP_VIEWPORT) expect(checked).toBeGreaterThan(0);
  }
});
