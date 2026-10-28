import { expect, test } from "@playwright/test";

test("8. 검색어를 모두 지우면 검색어 입력 안내 상태로 돌아간다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".group-select-command").click();
  await page.locator(".more-command").click();
  await page.getByRole("button", { name: "SEARCH", exact: true }).click();
  const search = page.getByRole("searchbox", { name: "Search everything" });
  await search.fill("missing");
  await expect(page.locator(".global-search-empty-state")).toHaveText(
    "No search results",
  );
  await search.fill("");
  await expect(page.locator(".global-search-empty-state")).toHaveText(
    "Enter a search term",
  );
});
