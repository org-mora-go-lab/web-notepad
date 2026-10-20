import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("2. 한글 검색어로 북마크 본문을 검색한다", async ({ page }) => {
  await seedSearchWorkspace(page, [
    createBookmarkFixture("b1", "gone", "회의 기록\n내일 일정 확인"),
  ]);
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("내일 일정");
  await expect(
    page.getByRole("button", { name: "Preview bookmark 회의 기록" }),
  ).toBeVisible();
});
