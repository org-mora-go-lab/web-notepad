import { expect, test } from "@playwright/test";

import {
  groupsCommand,
  openMoreMenu,
  openSystemGroupMenu,
} from "../../__util__";

test("4. 사이드바 아래 GROUP과 MORE 메뉴에서 기본 그룹과 가이드를 연다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const sidebar = page.locator("#groups-menu");
  const system = sidebar.locator(".group-more");
  const systemGroups = await openSystemGroupMenu(page);
  await expect(systemGroups.getByRole("button")).toHaveText([
    "All Group",
    "Ungrouped",
  ]);
  const sectionBox = (await sidebar.locator(".group-section").boundingBox())!;
  const systemBox = (await system.boundingBox())!;
  expect(systemBox.y).toBeGreaterThanOrEqual(sectionBox.y + sectionBox.height);
  const tools = await openMoreMenu(page);
  await expect(systemGroups).toHaveCount(0);
  await tools.getByRole("button", { name: "GUIDE" }).click();
  const guide = page.getByRole("dialog");
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 11");
  await guide.getByRole("button", { name: "SHORTCUT" }).click();
  await expect(tools).toHaveCount(0);
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
});
