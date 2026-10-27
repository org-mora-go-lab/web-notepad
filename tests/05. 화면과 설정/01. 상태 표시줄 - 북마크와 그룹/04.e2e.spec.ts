import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("4. All Group과 Ungrouped에는 우측 동작 아이콘을 표시하지 않는다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  for (const name of ["All Group", "Ungrouped"]) {
    const row = page.locator(".group-system-item", {
      has: page.getByRole("button", { name, exact: true }),
    });
    await expect(row.locator(".group-actions")).toHaveCount(0);
  }
});
