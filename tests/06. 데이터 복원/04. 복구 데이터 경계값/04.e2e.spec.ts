import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("4. Ungrouped의 잘못된 고정 상태는 해제한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      {
        id: "ungrouped",
        name: "Ungrouped",
        pinned: true,
        tabs: [{ id: "tab-1" }],
      },
    ],
  });
  await page.getByRole("button", { name: "Toggle groups" }).click();
  await page.locator(".system-group-command").click();
  await expect(
    page.getByRole("button", { name: "Ungrouped", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".group-system-menu .group-pin-indicator"),
  ).toHaveCount(0);
});
