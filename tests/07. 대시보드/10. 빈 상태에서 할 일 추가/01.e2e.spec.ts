import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardColumn, dashboardPanel, openPanel, readStoredState, writeStoredState } from "../../__util__";

test("1. 할 일 추가는 현재 그룹에 빈 노트를 열고 입력한 내용을 Ready로 표시한다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await writeStoredState(page, { activeGroupId: "work", groups: [
      createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "Personal")]),
      createGroupFixture("work", "Work", [createTabFixture("tab-2", "")]),
    ], nextTabNumber: 3 });
    await openPanel(page, "dashboard-panel");
    await dashboardColumn(page, "todo").getByRole("button", { name: "Add", exact: true }).click();
    await expect(dashboardPanel(page)).toHaveAttribute("aria-hidden", "true");
    const editor = page.locator("textarea").first();
    await expect(editor).toHaveValue("");
    await editor.fill("New task");
    const saved = await readStoredState(page);
    expect(saved.groups.find((group) => group.id === "work")!.tabs).toHaveLength(2);
    expect(saved.groups.find((group) => group.id === "ungrouped")!.tabs).toHaveLength(1);
    await openPanel(page, "dashboard-panel");
    await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toContainText("New task");
  }
});
