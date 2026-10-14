import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, createGroups, readStoredState } from "../../__util__";

test("2. 닫은 탭에는 닫을 당시의 그룹을 함께 기록한다", async ({ page }) => {
  await page.goto("/");
  await createGroups(page, "Work");
  const groupId = (await readStoredState(page)).activeGroupId;
  await closeActiveTabWithContent(page, "work archived note");

  expect((await readStoredState(page)).closedTabs?.[0].groupId).toBe(groupId);
});
