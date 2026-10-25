import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createTabFixture } from "../../__fixture__";
import { readStoredState, seedMoveGroupState } from "../../__util__";
import { moveTabToTarget } from "./__util__";

test("6. 닫힌 기록만 남은 그룹의 마지막 열린 탭을 옮겨도 편집 화면을 유지한다", async ({ page }) => {
  await seedMoveGroupState(page);
  const state = await readStoredState(page);
  const closedTab = createTabFixture("closed-source", "Closed note", { open: false });
  const closedEntry = createClosedTabFixture("closed-entry", state.groups[0].id, closedTab);
  await page.addInitScript((entry) => {
    const stored = JSON.parse(localStorage.getItem("web-notepad-storage")!);
    stored.state.closedTabs = [entry];
    localStorage.setItem("web-notepad-storage", JSON.stringify(stored));
  }, closedEntry);
  await page.reload();
  await expect.poll(async () => (await readStoredState(page)).closedTabs?.[0]?.tab.id).toBe("closed-source");

  await moveTabToTarget(page);

  await expect(page.locator(".loading-mark")).toHaveCount(0);
  await expect(page.locator("textarea")).toHaveValue("");
  const source = (await readStoredState(page)).groups[0];
  expect(source.tabs.filter((tab) => tab.open)).toHaveLength(1);
  expect((await readStoredState(page)).closedTabs?.[0].tab.id).toBe("closed-source");
});
