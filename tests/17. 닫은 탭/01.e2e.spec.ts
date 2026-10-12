import { expect, test } from "@playwright/test";

import {
  addTabButton,
  closeActiveTab,
  closeActiveTabWithContent,
  closedContents,
  openClosedPanel,
  readStoredState,
} from "../__util__";

test("1. 내용이 11자 이상인 탭을 닫으면 닫은 탭 목록 맨 위에 보관하고 빈 탭과 10자 이하인 탭은 보관하지 않는다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "first closed");
  await closeActiveTabWithContent(page, "second closed");
  await addTabButton(page).click();
  await closeActiveTab(page);
  await closeActiveTabWithContent(page, "short note");

  const { closedTabs = [] } = await readStoredState(page);
  expect(closedTabs.map((entry) => entry.tab.content)).toEqual(["second closed", "first closed"]);
  expect(closedTabs.every((entry) => entry.groupId === "ungrouped")).toBe(true);

  await page.reload();
  await openClosedPanel(page);
  await expect(closedContents(page)).toHaveText([
    "second closed",
    "first closed",
  ]);
});
