import { expect, test } from "@playwright/test";

import {
  createBookmarkFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import {
  openGlobalSearchPanel,
  readStoredState,
  seedSearchWorkspace,
} from "../../__util__";

test("2. 다른 그룹의 북마크 미리보기는 활성 그룹과 편집 탭을 변경하지 않는다", async ({
  page,
}) => {
  await seedSearchWorkspace(
    page,
    [],
    [
      createGroupFixture(
        "work",
        "Work",
        [createTabFixture("tab-2", "Work editor")],
        {
          bookmarks: [
            createBookmarkFixture("b1", "tab-2", "Preview elsewhere"),
          ],
        },
      ),
    ],
  );
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("Preview elsewhere");
  await page
    .getByRole("button", { name: "Preview bookmark Preview elsewhere" })
    .click();
  await expect(page.locator(".global-search-preview")).toBeVisible();
  expect((await readStoredState(page)).activeGroupId).toBe("ungrouped");
  await expect(page.locator("textarea")).toHaveValue("Editor");
});
