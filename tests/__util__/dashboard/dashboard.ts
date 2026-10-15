import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { writeStoredState } from "../state";

export const dashboardPanel = (page: Page) => page.locator("#dashboard-panel");
export const dashboardColumn = (
  page: Page,
  status: "icebox" | "todo" | "in-progress" | "done" | "closed",
) =>
  dashboardPanel(page).locator(`.dashboard-column[data-status="${status}"]`);

// Seeds the Ungrouped group with tab-1..tab-3 in Todo (orange) / Doing (green) / Done (red) and a Work group with one tab.
export async function seedDashboardTabs(page: Page) {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Alpha task\nalpha body", { tabColor: "orange" }),
        createTabFixture("tab-2", "Beta task", { tabColor: "green" }),
        createTabFixture("tab-3", "Gamma task", { tabColor: "red" }),
      ]),
      createGroupFixture("work", "Work", [createTabFixture("tab-4", "Work only task", { tabColor: "orange" })]),
    ],
    nextTabNumber: 5,
  });
}
