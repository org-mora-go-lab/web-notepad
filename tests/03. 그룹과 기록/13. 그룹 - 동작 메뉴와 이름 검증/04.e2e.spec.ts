import { expect, test } from "@playwright/test";

import { chooseGroupAction, createGroup, groupsCommand, readStoredState } from "../../__util__";

test("4. 수정할 그룹 이름이 비어 있으면 저장하지 않는다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  await chooseGroupAction(page, "Work", "수정");
  const input = page.getByRole("textbox", { name: "Edit Work group name" });
  await input.fill("   ");
  await expect(page.getByRole("button", { name: "Save group changes" })).toBeDisabled();
  await input.press("Enter");

  expect((await readStoredState(page)).groups.map((group) => group.name)).toContain("Work");
  await expect(input).toBeVisible();
});
