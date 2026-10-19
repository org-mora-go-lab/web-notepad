import { expect, test } from "@playwright/test";

import { createGroup, groupActionsButton, groupsCommand } from "../../__util__";

test("7. 이름 있는 그룹의 ⋮ 버튼은 고정·수정·삭제 명령을 연다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  await groupActionsButton(page, "Work").click();

  const actions = ["Pin Work group", "Edit Work group", "Delete Work group"];
  const tops = [];
  for (const name of actions) {
    const button = page.getByRole("button", { name, exact: true });
    await expect(button).toBeVisible();
    tops.push((await button.boundingBox())!.y);
  }
  expect(tops[0]).toBeLessThan(tops[1]);
  expect(tops[1]).toBeLessThan(tops[2]);
});
