import { expect, test } from "@playwright/test";

import { openPanel, openSettingsPanel, readStoredState } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../../__util__";
import { tabColorRadio } from "../__util__";

test("2. Tab Colors에서 순번의 색상을 바꾸면 해당 색상의 모든 탭이 새 색상으로 바뀌어 대시보드 상태를 유지한다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openSettingsPanel(page);

  await tabColorRadio(page, 1, "Yellow").check();
  await tabColorRadio(page, 2, "Teal").check();
  await tabColorRadio(page, 3, "Pink").check();

  await expect
    .poll(async () => {
      const state = await readStoredState(page);
      return state.groups.flatMap((group) =>
        group.tabs.map((tab) => tab.tabColor),
      );
    })
    .toEqual(["yellow", "pink", "teal", "yellow"]);

  await openPanel(page, "dashboard-panel");
  await expect(dashboardColumn(page, "todo")).toContainText("Alpha task");
  await expect(dashboardColumn(page, "in-progress")).toContainText("Beta task");
  await expect(dashboardColumn(page, "done")).toContainText("Gamma task");
  await expect(
    dashboardColumn(page, "todo").locator(".dashboard-card").first(),
  ).toHaveAttribute("data-tab-color", "yellow");
});
