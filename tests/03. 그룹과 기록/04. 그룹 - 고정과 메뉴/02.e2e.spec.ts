import { expect, test } from "@playwright/test";

import { chooseGroupAction, groupsCommand, seedSortableGroups } from "../../__util__";

test("2. 탭 메뉴의 그룹 이동 목록도 고정한 그룹을 맨 위에 배치한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  await chooseGroupAction(page, "Zulu", "고정");
  await page.keyboard.press("Escape");

  await page.locator(".tab-item.is-active").click({ button: "right" });
  await page.getByRole("menuitem", { name: "Move Group" }).click();
  await expect(page.locator(".move-group-option")).toHaveText([
    "Zulu", "가방", "나무", "다람쥐", "Alpha",
  ]);
});
