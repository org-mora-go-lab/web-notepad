import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("1. All Group을 선택하면 하단 그룹 이름에 All Group을 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await page.getByRole("button", { name: "All Group", exact: true }).click();
  await expect(page.locator(".group-select-name")).toHaveText("All Group");
});
