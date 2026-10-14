import { expect, test } from "@playwright/test";

import { openPanel, openSettingsPanel, readStoredState } from "../../__util__";
import { dashboardColumn } from "../../04. 패널과 검색/__util__";
import { settingsPanel } from "../__util__";
import { ARCHIVE_COLOR_CYCLE, seedArchivedColorCycle } from "./__util__";

test("10. 탭 색상 셔플은 열린 탭·북마크·닫은 탭을 새 순번 색상으로 바꾸고 상태를 유지한다", async ({ page }) => {
  await seedArchivedColorCycle(page);
  await openSettingsPanel(page);
  await settingsPanel(page)
    .getByRole("button", { name: "Shuffle tab colors", exact: true })
    .click();

  const state = await readStoredState(page);
  const cycle = state.settings!.tabColorCycle;
  expect(cycle).not.toEqual(ARCHIVE_COLOR_CYCLE);
  expect(state.groups[0].tabs.map((tab) => tab.tabColor)).toEqual(cycle);
  expect(state.groups[0].bookmarks[0].tabColor).toBe(cycle[0]);
  expect(state.closedTabs![0].tab.tabColor).toBe(cycle[2]);

  await openPanel(page, "dashboard-panel");
  await expect(dashboardColumn(page, "todo")).toContainText("Todo cycle note");
  await expect(dashboardColumn(page, "in-progress")).toContainText("WIP cycle note");
  await expect(dashboardColumn(page, "done")).toContainText("Done cycle note");
});
