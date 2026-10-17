import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("4. 사이드바는 GROUP 아래 맨 아래에 SETTINGS·GUIDE를 배치하고 단축키는 가이드에서 연다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const sidebar = page.locator("#groups-menu");
  const tools = sidebar.locator("#group-sidebar-tools");
  const groupToggle = sidebar.getByRole("button", { name: "GROUP", exact: true });
  await expect(tools.getByRole("button")).toHaveText(["SETTINGS", "GUIDE"]);
  await expect(sidebar.getByRole("button", { name: "SHORTCUT" })).toHaveCount(0);
  const settingsBox = (await tools.getByRole("button", { name: "SETTINGS" }).boundingBox())!;
  const groupBox = (await groupToggle.boundingBox())!;
  expect(settingsBox.y).toBeGreaterThanOrEqual(groupBox.y + groupBox.height);
  await tools.getByRole("button", { name: "GUIDE" }).click();
  const guide = page.getByRole("dialog");
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 11");
  await guide.getByRole("button", { name: "SHORTCUT" }).click();
  await expect(sidebar).toHaveCount(0);
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "false");
});
