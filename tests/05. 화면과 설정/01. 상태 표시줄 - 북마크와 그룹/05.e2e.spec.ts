import { expect, test } from "@playwright/test";

import { createGroup, groupsCommand } from "../../__util__";

test("5. PC에서 그룹명을 우클릭한 메뉴의 BOOKMARK는 해당 그룹을 선택해 연다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  const row = page.locator(".group-item", { has: page.getByRole("button", { name: "Work", exact: true }) });
  await row.getByRole("button", { name: "Work", exact: true }).click({ button: "right" });
  await row.getByRole("button", { name: "Work · BOOKMARK" }).click();

  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator(".group-current-value")).toHaveText("Work");
});
