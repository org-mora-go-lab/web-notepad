import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { createGroups, groupMenu, groupsCommand, groupStatusName, switchGroup } from "../../__util__";

test("1. Ungrouped 외에 이름 있는 그룹을 만들고 전환할 수 있으며 PC는 선택 후에도 드롭다운을 유지하고 모바일은 바로 닫는다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("textarea").fill("ungrouped note");
  await createGroups(page, "Work");
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(page.locator("textarea")).toHaveValue("");

  await switchGroup(page, "Ungrouped");
  await expect(groupStatusName(page)).toHaveText("Ungrouped");
  await expect(page.locator("textarea")).toHaveValue("ungrouped note");

  await switchGroup(page, "Work");
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(page.locator("textarea")).toHaveValue("");

  // PC keeps the dropdown open after a selection.
  await groupsCommand(page).click();
  await groupMenu(page).locator(".group-item").filter({ hasText: "Ungrouped" }).getByRole("button", { name: "Ungrouped", exact: true }).click();
  await expect(groupStatusName(page)).toHaveText("Ungrouped");
  await expect(groupMenu(page)).toBeVisible();
  await page.keyboard.press("Escape");

  // Mobile closes it right away.
  await page.setViewportSize(MOBILE_VIEWPORT);
  await groupsCommand(page).click();
  await groupMenu(page).locator(".group-item").filter({ hasText: "Work" }).getByRole("button", { name: "Work", exact: true }).click();
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(groupMenu(page)).toHaveCount(0);
});
