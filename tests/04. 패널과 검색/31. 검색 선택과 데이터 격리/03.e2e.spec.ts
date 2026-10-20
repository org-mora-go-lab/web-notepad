import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import {
  openGlobalSearchPanel,
  readStoredState,
  seedSearchWorkspace,
} from "../../__util__";

test("3. 미리보기 선택은 원본이 없는 북마크를 새 편집 탭으로 복원하지 않는다", async ({
  page,
}) => {
  await seedSearchWorkspace(page, [
    createBookmarkFixture("b1", "orphan", "Orphan preview"),
  ]);
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("Orphan");
  await page
    .getByRole("button", { name: "Preview bookmark Orphan preview" })
    .click();
  await expect(page.locator(".global-search-preview")).toBeVisible();
  await expect(page.getByRole("tab")).toHaveCount(1);
  expect(
    (await readStoredState(page)).groups[0].tabs.map((tab) => tab.id),
  ).toEqual(["tab-1"]);
});
