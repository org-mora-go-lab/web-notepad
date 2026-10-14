import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("6. 그룹 이름 입력의 Cmd+A는 이름 전체를 선택한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const input = page.locator('#groups-menu input[aria-label="New group name"]');
  const name = "새 그룹 이름";
  await input.fill(name);
  await page.keyboard.press("Meta+a");
  await expect.poll(() => input.evaluate((element) => {
    const target = element as HTMLInputElement;
    return [document.activeElement === target, target.selectionStart, target.selectionEnd];
  })).toEqual([true, 0, name.length]);
});
