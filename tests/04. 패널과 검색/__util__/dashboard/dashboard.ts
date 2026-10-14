import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../../__fixture__";
import { writeStoredState } from "../../../__util__";

export const dashboardPanel = (page: Page) => page.locator("#dashboard-panel");
export const dashboardColumn = (page: Page, status: "todo" | "in-progress" | "done") =>
  dashboardPanel(page).locator(`.dashboard-column[data-status="${status}"]`);

// Seeds the Ungrouped group with tab-1..tab-3 in Todo (gray) / WIP (green) / Done (purple) and a Work group with one tab.
export async function seedDashboardTabs(page: Page) {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Alpha task\nalpha body", { tabColor: "gray" }),
        createTabFixture("tab-2", "Beta task", { tabColor: "green" }),
        createTabFixture("tab-3", "Gamma task", { tabColor: "purple" }),
      ]),
      createGroupFixture("work", "Work", [createTabFixture("tab-4", "Work only task", { tabColor: "gray" })]),
    ],
    nextTabNumber: 5,
  });
}
