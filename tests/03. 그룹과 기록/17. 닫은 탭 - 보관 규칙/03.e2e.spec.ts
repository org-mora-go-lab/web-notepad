import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, readStoredState } from "../../__util__";

test("3. 닫은 탭은 목록의 맨 위부터 최신순으로 보관한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "first closed");
  await closeActiveTabWithContent(page, "second closed");

  expect((await readStoredState(page)).closedTabs?.map((entry) => entry.tab.content))
    .toEqual(["second closed", "first closed"]);
});
