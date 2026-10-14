import { expect, test } from "@playwright/test";

import { createGroup, groupActionsButton, groupsCommand } from "../../__util__";

test("1. 이름 있는 그룹의 … 버튼은 고정·수정·삭제 명령을 연다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  await groupActionsButton(page, "Work").click();

  await expect(page.getByRole("button", { name: "Pin Work group", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit Work group", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete Work group", exact: true })).toBeVisible();
});
