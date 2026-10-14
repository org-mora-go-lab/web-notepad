import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, readStoredState } from "../../__util__";

test("1. 내용이 11자 이상인 탭을 닫은 탭 목록에 보관한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "12345678901");

  expect((await readStoredState(page)).closedTabs?.map((entry) => entry.tab.content))
    .toEqual(["12345678901"]);
});
