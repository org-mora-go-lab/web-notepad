import { expect, test } from "@playwright/test";

import { groupsCommand, readStoredState } from "../../__util__";

test("6. 새 그룹 이름 입력란에서 Enter를 누르면 그룹을 만든다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const input = page.getByRole("textbox", { name: "New group name" });
  await input.fill("Enter group");
  await input.press("Enter");

  expect((await readStoredState(page)).groups.map((group) => group.name)).toContain("Enter group");
});
