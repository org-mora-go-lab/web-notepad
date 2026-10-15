import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("6. 검색 목록과 우측 미리보기를 표시하고 스크롤 상단을 구분한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState(20));
  await openGlobalSearchPanel(page);
  await page.getByRole("searchbox", { name: "Search everything" }).fill("Work");
  await page
    .getByRole("button", { name: "Preview bookmark Work plan", exact: true })
    .click();

  const preview = page.getByRole("region", { name: "Selected tab preview" });
  const results = page.locator(".global-search-results-pane");
  const previewPane = page.locator(".global-search-preview-pane");
  await expect(preview).toContainText("Work plan");
  await expect(preview).toContainText("Work");
  await expect(preview).toContainText("Work quarterly goals");
  await expect(preview.locator(".search-highlight")).toHaveText([
    "Work",
    "Work",
    "Work",
  ]);
  await expect(page.locator("textarea")).toHaveValue("Current note");
  await expect(page.locator("#global-search-popup")).toHaveAttribute("open", "");
  const resultsBox = (await results.boundingBox())!;
  expect((await previewPane.boundingBox())!.x).toBeGreaterThanOrEqual(
    resultsBox.x + resultsBox.width,
  );
  const list = page.locator(".global-search-list");
  await list.evaluate((element) => element.scrollTo(0, 120));
  await expect(results).toHaveClass(/is-scrolled/);
  const searchBox = (await page.locator(".global-search .search-field").boundingBox())!;
  const itemBox = (await page.locator(".global-search-result").first().boundingBox())!;
  expect(searchBox.x + searchBox.width).toBeCloseTo(itemBox.x + itemBox.width, 0);
  await expect
    .poll(() =>
      results.evaluate((element) =>
        getComputedStyle(element, "::after").opacity,
      ),
    )
    .toBe("1");
});
