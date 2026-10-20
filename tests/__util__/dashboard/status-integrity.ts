import { expect, type Page } from "@playwright/test";

import type { GroupEntry, NoteTab } from "@/src/4-entity/notepad";

import {
  createBookmarkFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import { writeStoredState } from "../state";
import { openPanel } from "../workspace";
import { dashboardPanel } from "./dashboard";

export async function seedStatusIntegrity(
  page: Page,
  tabPatch: Partial<NoteTab> = {},
  groupPatch: Partial<GroupEntry> = {},
  statePatch: Record<string, unknown> = {},
) {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    nextTabNumber: 4,
    allGroupDashboardVisibility: { icebox: true, closed: true },
    groups: [
      createGroupFixture(
        "ungrouped",
        "Ungrouped",
        [
          createTabFixture("tab-1", "Integrity task\nkept body", {
            tabColor: "gray",
            selectedLines: [1],
            bookmarked: true,
            ...tabPatch,
          }),
          createTabFixture("tab-2", "Sibling task", { tabColor: "gray" }),
        ],
        {
          dashboardVisibility: { icebox: true, closed: true },
          bookmarks: [
            createBookmarkFixture("b1", "tab-1", "Integrity task\nkept body", {
              selectedLines: [1],
            }),
          ],
          ...groupPatch,
        },
      ),
      createGroupFixture("work", "Work", [
        createTabFixture("tab-3", "Other group", { tabColor: "gray" }),
      ]),
    ],
    ...statePatch,
  });
  await expect(page.locator("textarea").first()).toBeVisible();
  await openPanel(page, "dashboard-panel");
}

export async function moveDashboardCard(page: Page, label: string) {
  await dashboardPanel(page)
    .locator(".dashboard-card", { hasText: "Integrity task" })
    .click({ button: "right" });
  await page
    .getByRole("menu")
    .locator(".tab-context-menu-footer")
    .getByRole("menuitem", { name: label, exact: true })
    .click();
  await expect(page.getByRole("menu")).toHaveCount(0);
}
