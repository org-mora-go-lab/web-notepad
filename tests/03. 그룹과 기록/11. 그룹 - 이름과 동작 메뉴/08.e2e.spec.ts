import { expect, test } from "@playwright/test";

import {
  chooseGroupAction,
  createGroup,
  groupsCommand,
  readStoredState,
} from "../../__util__";

test("8. 수정한 그룹 이름의 앞뒤 공백을 제거해 저장한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  await chooseGroupAction(page, "Work", "수정");
  await page
    .getByRole("textbox", { name: "Edit Work group name" })
    .fill("  Focus  ");
  await page.getByRole("button", { name: "Save group changes" }).click();

  const names = (await readStoredState(page)).groups.map((group) => group.name);
  expect(names).toContain("Focus");
  expect(names).not.toContain("  Focus  ");
});
