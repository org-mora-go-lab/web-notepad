import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("1. 하단 더보기의 SEARCH를 선택하면 전체 검색 팝업을 연다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await page.locator(".more-command").click();
  const search = page.locator(".footer .global-search-command");
  await expect(search).toBeVisible();
  await expect(
    page.locator('.header button[aria-controls="global-search-popup"]'),
  ).toHaveCount(0);

  await search.click();
  await expect(page.locator("#global-search-popup")).toHaveAttribute(
    "open",
    "",
  );
});
