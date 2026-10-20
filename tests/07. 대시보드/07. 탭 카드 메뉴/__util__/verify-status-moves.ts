import { expect, type Page } from "@playwright/test";

import type { TabColor, TabStatus } from "@/src/4-entity/notepad";

import { createGroupFixture, createTabFixture } from "../../../__fixture__";
import { dashboardColumn, openPanel, writeStoredState } from "../../../__util__";

export async function verifyStatusMoves(page: Page, source: TabStatus, customNames = false) {
  const statuses: TabStatus[] = ["icebox", "todo", "in-progress", "done", "closed"];
  const labels = customNames
    ? { icebox: "Notes", todo: "Ready", "in-progress": "Working", done: "Complete", closed: "Archived" }
    : { icebox: "Note", todo: "To Do", "in-progress": "Doing", done: "Done", closed: "Closed" };
  const colors: Record<TabStatus, TabColor> = {
    icebox: "gray", todo: "gray", "in-progress": "indigo", done: "teal", closed: "gray",
  };
  const targets = statuses.filter((status) => status !== source);
  for (const target of targets) {
    await writeStoredState(page, {
      activeGroupId: "ungrouped",
      groups: [createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Moving task", {
          tabColor: colors[source],
          dashboardStatus: source === "icebox" || source === "closed" ? source : undefined,
        }),
      ], {
        dashboardVisibility: { icebox: true, closed: true },
        dashboardStatusNames: labels,
      })],
    });
    await openPanel(page, "dashboard-panel");
    const card = dashboardColumn(page, source).locator(".dashboard-card", { hasText: "Moving task" });
    await card.click({ button: "right" });
    const menu = page.getByRole("menu");
    const moves = menu.locator(".tab-context-menu-footer").getByRole("menuitem");
    await expect(moves).toHaveText(targets.map((status) => labels[status]));
    await expect(moves.filter({ hasText: new RegExp(`^${labels[source]}$`) })).toHaveCount(0);
    await menu.locator(".tab-context-menu-footer").getByRole("menuitem", { name: labels[target], exact: true }).click();
    await expect(menu).toHaveCount(0);
    await expect(dashboardColumn(page, target).locator(".dashboard-card", { hasText: "Moving task" })).toBeVisible();
    await expect(card).toHaveCount(0);
  }
}
