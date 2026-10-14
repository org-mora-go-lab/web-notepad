import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("1. 하단 메뉴는 BOOKMARK·DASHBOARD·그룹 선택 순서이고 SEARCH는 MENU에서 CLOSED 아래에 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".status-light, .save-state")).toHaveCount(0);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const classes = ["bookmark-command", "dashboard-command", "group-select-command"];
    const commands = page.locator(".status-meta .status-command:visible");
    await expect(commands).toHaveCount(classes.length);
    for (const [index, command] of (await commands.all()).entries()) {
      await expect(command).toHaveClass(new RegExp(classes[index]));
    }
  }
  const menu = page.locator(".additional-tools-menu");
  await page.getByRole("button", { name: "MENU" }).click();
  const menuItems = menu.locator('[role="menuitem"]');
  await expect(menuItems.last()).toHaveClass(/additional-tools-search/);
});
