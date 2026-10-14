import { expect, test } from "@playwright/test";

import { createGroup, groupsCommand, groupStatusName, readActiveGroup } from "../../__util__";

test("5. 새 그룹을 생성하면 해당 그룹을 활성 그룹으로 전환한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "New group");

  await expect(groupStatusName(page)).toHaveText("New group");
  expect((await readActiveGroup(page)).name).toBe("New group");
});
