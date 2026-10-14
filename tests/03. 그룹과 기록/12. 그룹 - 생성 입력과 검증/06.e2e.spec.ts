import { expect, test } from "@playwright/test";

import { groupsCommand, readStoredState } from "../../__util__";

test("6. + 버튼을 누르면 그룹을 만든다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await page.getByRole("textbox", { name: "New group name" }).fill("Button group");
  await page.getByRole("button", { name: "Create group" }).click();

  expect((await readStoredState(page)).groups.map((group) => group.name)).toContain("Button group");
});
