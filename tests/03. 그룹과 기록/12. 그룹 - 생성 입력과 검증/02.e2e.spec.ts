import { expect, test } from "@playwright/test";

import { createGroup, groupsCommand, readStoredState } from "../../__util__";

test("2. 새 그룹 이름의 앞뒤 공백을 제거해 저장한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "  Work  ");

  const names = (await readStoredState(page)).groups.map((group) => group.name);
  expect(names).toContain("Work");
  expect(names).not.toContain("  Work  ");
});
