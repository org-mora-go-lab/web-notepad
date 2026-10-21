import { expect, test } from "@playwright/test";

import { groupsCommand, readActiveGroup } from "../../__util__";

test("1. Cmd+B는 편집기와 그룹 입력란에서 패널을 토글하고 노트를 보존한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("Keep this note\nunchanged body");
  const before = await readActiveGroup(page);
  await editor.press("Meta+b");
  await expect(page.locator("#groups-menu")).toBeVisible();
  await expect(groupsCommand(page)).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("textbox", { name: "New group name" }).focus();
  await page.keyboard.press("Meta+b");
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(groupsCommand(page)).toHaveAttribute("aria-expanded", "false");
  await expect(editor).toHaveValue("Keep this note\nunchanged body");
  expect(await readActiveGroup(page)).toEqual(before);
});
