import { expect, test } from "@playwright/test";

import { openBookmarksPanel } from "../../__util__";

test("4. 북마크 모달 배경 클릭은 팝업을 닫고 편집기를 계속 사용할 수 있다", async ({
  page,
}) => {
  await page.goto("/");
  await openBookmarksPanel(page);
  await page.mouse.click(4, 4);
  await expect(page.locator("#bookmarks-panel")).toBeHidden();
  await page.locator("textarea").click();
  await page.keyboard.type("Continue writing");
  await expect(page.locator("textarea")).toHaveValue("Continue writing");
});
