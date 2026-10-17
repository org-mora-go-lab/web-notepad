import { expect, test } from "@playwright/test";

import { seedSortableGroups, switchGroup } from "../../__util__";

test("2. All Group 선택을 저장하고 새로고침 후 복원한다", async ({ page }) => {
  await seedSortableGroups(page);
  await switchGroup(page, "All Group");
  await page.reload();

  await expect(page.locator(".group-current-value")).toHaveText("All Group");
  await expect(page.locator(".tab-item")).toHaveCount(6);
});
