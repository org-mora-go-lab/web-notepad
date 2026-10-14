import { expect, test } from "@playwright/test";

import { addTabButton, closeActiveTab, closeActiveTabWithContent, readStoredState } from "../../__util__";

test("7. 빈 탭과 내용이 10자 이하인 탭은 닫은 탭에 보관하지 않고 영구 삭제한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "12345678901");
  await addTabButton(page).click();
  await closeActiveTab(page);
  await closeActiveTabWithContent(page, "1234567890");

  expect((await readStoredState(page)).closedTabs?.map((entry) => entry.tab.content)).toEqual([
    "12345678901",
  ]);
});
