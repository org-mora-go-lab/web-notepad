import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import {
  openSystemGroupMenu,
  switchGroup,
  writeStoredState,
} from "../../__util__";

test("7. All My Group과 All Shared Group은 소유 유형별 탭만 모아 표시한다", async ({
  page,
}) => {
  const sharedGroup = createGroupFixture(
    "shared-00000000-0000-4000-8000-000000000001",
    "Shared team",
    [createTabFixture("shared-tab", "Shared note")],
  );
  await page.route("**/api/auth/session", (route) =>
    route.fulfill({ json: { user: { id: "test-user" } } }),
  );
  await page.route("**/api/groups", (route) =>
    route.fulfill({
      json: {
        groups: [
          {
            id: sharedGroup.id,
            ownerId: "another-user",
            revision: 1,
            data: sharedGroup,
            updatedAt: 1,
          },
        ],
      },
    }),
  );
  await writeStoredState(page, {
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("local-tab", "Local note"),
      ]),
      sharedGroup,
    ],
  });

  const menu = await openSystemGroupMenu(page);
  await expect(menu.locator(":scope > button")).toHaveText([
    "All Group",
    "All My Group",
    "All Shared Group",
    "Ungrouped",
  ]);

  await switchGroup(page, "All My Group");
  await expect(page.getByRole("tab", { name: "Local note" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Shared note" })).toHaveCount(0);

  await switchGroup(page, "All Shared Group");
  await expect(page.getByRole("tab", { name: "Shared note" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Local note" })).toHaveCount(0);
});
