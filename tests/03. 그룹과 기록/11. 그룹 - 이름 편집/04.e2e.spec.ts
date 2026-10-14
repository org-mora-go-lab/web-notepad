import { expect, test } from "@playwright/test";

import { chooseGroupAction, createGroups, groupsCommand, groupStatusName } from "../../__util__";

test("4. 이름 수정 입력에서 Escape를 누르면 편집을 취소한다", async ({ page }) => {
  await page.goto("/");
  await createGroups(page, "Work");
  await groupsCommand(page).click();
  await chooseGroupAction(page, "Work", "수정");
  const input = page.getByRole("textbox", { name: "Edit Work group name" });
  await input.fill("Escaped");
  await input.press("Escape");
  await expect(input).toHaveCount(0);
  await expect(groupStatusName(page)).toHaveText("Work");
});
