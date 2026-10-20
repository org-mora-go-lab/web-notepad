import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("5. 검색어를 좁혀도 선택 결과가 남아 있으면 미리보기를 유지한다", async ({
  page,
}) => {
  await seedSearchWorkspace(page, [
    createBookmarkFixture("b1", "gone", "Alpha preview\nunique detail"),
  ]);
  await openGlobalSearchPanel(page);
  const search = page.getByRole("searchbox", { name: "Search everything" });
  await search.fill("Alpha");
  await page
    .getByRole("button", { name: "Preview bookmark Alpha preview" })
    .click();
  await search.fill("unique detail");
  await expect(page.locator(".global-search-result mark")).toHaveText([
    "unique detail",
  ]);
  await expect(page.locator(".global-search-preview pre")).toHaveText(
    "Alpha preview\nunique detail",
  );
});
