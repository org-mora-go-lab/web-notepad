import { expect, test } from "@playwright/test";

import { groupStatusName, openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("9. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  await page.getByRole("searchbox", { name: "전체 검색" }).fill("Work");
  await page.getByRole("button", { name: "그룹 Work 선택" }).click();
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(page.locator("textarea")).toHaveValue("Quarterly goals");
});
