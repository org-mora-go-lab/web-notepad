import { expect, test } from "@playwright/test";

import { openPanel, openSettingsPanel, readStoredState } from "../../__util__";
import { dashboardColumn } from "../../04. 패널과 검색/__util__";
import { settingsPanel } from "../__util__";
import { seedArchivedColorCycle } from "./__util__";

test("5. 탭 색상 초기화는 열린 탭·북마크·닫은 탭을 기본 순번 색상으로 바꾸고 상태를 유지한다", async ({ page }) => {
  await seedArchivedColorCycle(page);
  await openSettingsPanel(page);
  await settingsPanel(page)
    .getByRole("button", { name: "Reset tab colors", exact: true })
    .click();

  const state = await readStoredState(page);
  expect(state.settings!.tabColorCycle).toEqual(["gray", "green", "purple"]);
  expect(state.groups[0].tabs.map((tab) => tab.tabColor)).toEqual(["gray", "green", "purple"]);
  expect(state.groups[0].bookmarks[0].tabColor).toBe("gray");
  expect(state.closedTabs![0].tab.tabColor).toBe("purple");

  await openPanel(page, "dashboard-panel");
  await expect(dashboardColumn(page, "todo")).toContainText("Todo cycle note");
  await expect(dashboardColumn(page, "in-progress")).toContainText("Doing cycle note");
  await expect(dashboardColumn(page, "done")).toContainText("Done cycle note");
});
