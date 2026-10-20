import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("5. HTML 형태의 북마크 본문은 미리보기에서 실행하지 않고 그대로 표시한다", async ({
  page,
}) => {
  const content = "Security needle\n<img src=x onerror=alert(1)>";
  await seedSearchWorkspace(page, [
    createBookmarkFixture("b1", "gone", content),
  ]);
  await openGlobalSearchPanel(page);
  await page
    .getByRole("searchbox", { name: "Search everything" })
    .fill("needle");
  await page
    .getByRole("button", { name: "Preview bookmark Security needle" })
    .click();
  await expect(page.locator(".global-search-preview pre")).toHaveText(content);
  await expect(page.locator(".global-search-preview img")).toHaveCount(0);
});
