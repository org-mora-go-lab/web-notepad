import { expect, test } from "@playwright/test";

import { groupsCommand, openMoreMenu } from "../../__util__";

test("4. 사이드바 아래에 기본 그룹을 두고 단축키는 하단 더보기의 가이드에서 연다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const sidebar = page.locator("#groups-menu");
  const system = sidebar.locator(".group-system-list");
  await expect(system.locator(".group-select")).toHaveText(["All Group", "Ungrouped"]);
  const sectionBox = (await sidebar.locator(".group-section").boundingBox())!;
  const systemBox = (await system.boundingBox())!;
  expect(systemBox.y).toBeGreaterThanOrEqual(sectionBox.y + sectionBox.height);
  await groupsCommand(page).press("Escape");
  const tools = await openMoreMenu(page);
  await tools.getByRole("button", { name: "GUIDE" }).click();
  const guide = page.getByRole("dialog");
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 11");
  await guide.getByRole("button", { name: "SHORTCUT" }).click();
  await expect(tools).toHaveCount(0);
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "false");
});
