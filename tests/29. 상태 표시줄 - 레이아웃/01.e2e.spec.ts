import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("1. 하단 메뉴는 그룹명·SEARCH·BOOKMARK·그룹 선택 순서이고 저장 상태 아이콘은 표시하지 않는다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".status-light, .save-state")).toHaveCount(0);
  const classes = ["group-status-command", "global-search-command", "bookmark-command", "group-select-command"];
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const commands = page.locator(".status-meta .status-command:visible");
    await expect(commands).toHaveCount(classes.length);
    for (const [index, command] of (await commands.all()).entries()) {
      await expect(command).toHaveClass(new RegExp(classes[index]));
    }
  }
});
