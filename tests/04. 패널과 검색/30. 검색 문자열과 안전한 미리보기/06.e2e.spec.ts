import { expect, test } from "@playwright/test";

import {
  createBookmarkFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("6. 그룹 이름 검색은 해당 그룹의 북마크도 함께 찾는다", async ({
  page,
}) => {
  await seedSearchWorkspace(
    page,
    [],
    [
      createGroupFixture(
        "work",
        "Project Orion",
        [createTabFixture("tab-2", "Work")],
        { bookmarks: [createBookmarkFixture("b1", "gone", "Budget")] },
      ),
    ],
  );
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("Orion");
  await expect(
    page.locator(".global-search-groups .global-search-result"),
  ).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Preview bookmark Budget" }),
  ).toBeVisible();
});
