import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { chooseGroupAction, createGroups, groupsCommand, groupStatusName } from "../../__util__";

test("2. 모바일에서도 이름 수정 저장 버튼을 화면 안에 표시하고 변경을 저장한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await createGroups(page, "Work");
  await groupsCommand(page).click();
  await chooseGroupAction(page, "Work", "수정");
  await page.getByRole("textbox", { name: "Edit Work group name" }).fill("Mobile");
  const save = page.getByRole("button", { name: "Save group changes" });
  await expect(save).toBeInViewport();
  await save.click();
  await expect(groupStatusName(page)).toHaveText("Mobile");
});
