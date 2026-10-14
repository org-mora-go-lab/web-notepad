import { expect, test } from "@playwright/test";

import { bookmarksCommand } from "../../__util__";

test("2. Search bookmarks창은 헤더 아래에 표시하며 위쪽 여백 14px, 아래쪽 여백 6px를 적용한다", async ({ page }) => {
  await page.goto("/");
  await bookmarksCommand(page).click();
  const search = page.getByRole("searchbox", { name: "Search bookmarks" });
  await expect(search).toBeVisible();
  const margins = await search.evaluate((element) => {
    const style = getComputedStyle(element.closest("label")!);
    return [style.marginTop, style.marginBottom];
  });
  expect(margins).toEqual(["14px", "6px"]);
});
