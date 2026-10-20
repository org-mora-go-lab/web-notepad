import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import {
  openGlobalSearchPanel,
  readActiveGroup,
  restoreWorkspace,
} from "../../__util__";

test("2. 원본 ID가 손상된 북마크도 내용을 보존해 검색할 수 있다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    bookmarks: [
      {
        ...createBookmarkFixture("b1", "tab-1", "Orphan kept"),
        sourceTabId: null,
      },
    ],
  });
  expect((await readActiveGroup(page)).bookmarks[0]).toMatchObject({
    sourceTabId: "",
    content: "Orphan kept",
  });
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("Orphan kept");
  await expect(
    page.getByRole("button", { name: "Preview bookmark Orphan kept" }),
  ).toBeVisible();
});
