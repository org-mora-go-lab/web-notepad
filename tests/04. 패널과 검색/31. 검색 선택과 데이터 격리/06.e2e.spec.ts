import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("6. 검색 팝업을 닫았다 다시 열면 이전 미리보기 선택을 복원하지 않는다", async ({
  page,
}) => {
  await seedSearchWorkspace(page, [
    createBookmarkFixture("b1", "gone", "Alpha preview"),
  ]);
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("Alpha");
  await page
    .getByRole("button", { name: "Preview bookmark Alpha preview" })
    .click();
  await expect(page.locator(".global-search-preview")).toBeVisible();
  await page.keyboard.press("Escape");
  await openGlobalSearchPanel(page);
  await expect(page.locator(".global-search-preview")).toHaveCount(0);
});
