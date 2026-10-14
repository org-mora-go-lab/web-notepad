import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("1. 새 그룹 이름 입력란은 Group name placeholder를 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();

  await expect(page.getByRole("textbox", { name: "New group name" })).toHaveAttribute(
    "placeholder",
    "Group name",
  );
});
