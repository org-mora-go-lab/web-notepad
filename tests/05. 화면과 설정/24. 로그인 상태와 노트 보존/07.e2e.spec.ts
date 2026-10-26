import { expect, test } from "@playwright/test";

import {
  authProfile,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import {
  authenticateBrowser,
  readStoredState,
  writeStoredState,
} from "../../__util__";

test("7. Logout은 로컬 노트와 줄 선택을 지우지 않는다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await writeStoredState(page, {
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Private local note\nkeep me", {
          selectedLines: [1],
        }),
      ]),
    ],
  });
  await page
    .getByRole("button", { name: authProfile.nickname + " · Account menu" })
    .click();
  await page.getByRole("menuitem", { name: "Logout", exact: true }).click();
  await expect(page.locator("a.auth-command")).toBeVisible();
  await page.reload();
  await expect(page.locator("textarea")).toHaveValue(
    "Private local note\nkeep me",
  );
  expect((await readStoredState(page)).groups[0].tabs[0].selectedLines).toEqual(
    [1],
  );
});
