import { expect, test } from "@playwright/test";

import {
  createBookmarkFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("1. 그룹별로 같은 북마크 ID가 있어도 선택한 결과의 내용만 미리보기한다", async ({
  page,
}) => {
  await seedSearchWorkspace(
    page,
    [createBookmarkFixture("same", "gone1", "Shared alpha\nFirst body")],
    [
      createGroupFixture(
        "work",
        "Work",
        [createTabFixture("tab-2", "Work editor")],
        {
          bookmarks: [
            createBookmarkFixture("same", "gone2", "Shared beta\nSecond body"),
          ],
        },
      ),
    ],
  );
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("Shared");
  await page
    .getByRole("button", { name: "Preview bookmark Shared beta" })
    .click();
  await expect(page.locator(".global-search-preview pre")).toHaveText(
    "Shared beta\nSecond body",
  );
  await page
    .getByRole("button", { name: "Preview bookmark Shared alpha" })
    .click();
  await expect(page.locator(".global-search-preview pre")).toHaveText(
    "Shared alpha\nFirst body",
  );
  await expect(
    page.locator('.global-search-result[aria-current="true"]'),
  ).toHaveCount(1);
});
