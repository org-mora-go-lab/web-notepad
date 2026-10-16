import { expect, test } from "@playwright/test";

import { chooseTabMenuItem, cycleActiveTabColor, readStoredState } from "../../__util__";

test("3. 북마크를 추가하면 탭 색상을 보관한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("bookmark color");
  await cycleActiveTabColor(page, 2);
  await chooseTabMenuItem(page, "Bookmark");

  expect((await readStoredState(page)).groups[0].bookmarks[0].tabColor).toBe("teal");
});
