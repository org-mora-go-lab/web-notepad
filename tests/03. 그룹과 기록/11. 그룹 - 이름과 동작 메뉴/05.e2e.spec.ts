path_helper: node.save: Permission denied
import { expect, test } from "@playwright/test";

import {
  groupsCommand,
  openSystemGroupMenu,
  readStoredState,
} from "../../__util__";

test("5. 새 그룹 이름은 최대 60자로 입력하고 저장한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await openSystemGroupMenu(page);
  const input = page.getByRole("textbox", { name: "New group name" });
  await expect(input).toHaveAttribute("maxlength", "60");
  await input.fill("A".repeat(70));
  await expect(input).toHaveValue("A".repeat(60));
  await page.getByRole("button", { name: "Create group" }).click();

  expect(
    (await readStoredState(page)).groups.map((group) => group.name),
  ).toContain("A".repeat(60));
});
