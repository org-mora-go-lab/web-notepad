import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("4. All Group과 Ungrouped에는 우측 동작 아이콘을 표시하지 않는다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await page.locator(".more-command").click();
  for (const name of ["All Group", "Ungrouped"]) {
    const item = page
      .locator("#group-more-menu")
      .getByRole("button", { name, exact: true });
    await expect(item).toBeVisible();
    await expect(item.locator(".group-actions")).toHaveCount(0);
  }
});
