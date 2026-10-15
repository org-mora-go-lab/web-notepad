import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("9. PC 검색 UI는 왼쪽에 두고 선택한 탭 미리보기는 오른쪽에 배치한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  await page.getByRole("searchbox", { name: "Search everything" }).fill("Work plan");
  await page.getByRole("button", { name: "Preview bookmark Work plan" }).click();
  const results = (await page.locator(".global-search-results-pane").boundingBox())!;
  const preview = (await page.locator(".global-search-preview-pane").boundingBox())!;

  expect(preview.x).toBeGreaterThanOrEqual(results.x + results.width);
  await expect(page.locator(".global-search-results-pane").getByRole("searchbox")).toBeVisible();
});
