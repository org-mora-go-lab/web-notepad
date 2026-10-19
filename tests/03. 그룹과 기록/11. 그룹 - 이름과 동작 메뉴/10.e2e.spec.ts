import { expect, test } from "@playwright/test";

import { createGroup, groupsCommand } from "../../__util__";

test("10. PC에서 그룹명을 우클릭하면 선택을 바꾸지 않고 동작 메뉴를 연다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");

  const row = page.locator(".group-item", { has: page.getByRole("button", { name: "Work", exact: true }) });
  const select = row.getByRole("button", { name: "Work", exact: true });
  const selectedBefore = await select.getAttribute("aria-pressed");
  await select.click({ button: "right" });

  await expect(select).toHaveAttribute("aria-pressed", selectedBefore!);
  const dropdown = row.locator(".group-action-dropdown");
  await expect(dropdown).toBeVisible();
  await expect(dropdown.getByRole("button")).toHaveText(["Pin", "Edit", "Delete"]);
});
