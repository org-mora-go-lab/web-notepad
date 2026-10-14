import { expect, test } from "@playwright/test";

import {
  createClosedTabFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import { openPanel, readStoredState, writeStoredState } from "../../__util__";
import { dashboardColumn, dashboardPanel } from "../__util__";

test("7. 삭제된 그룹의 닫은 탭은 Ungrouped 대시보드에서 표시하고 복원한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Open note", { tabColor: "gray" }),
      ]),
    ],
    closedTabs: [
      createClosedTabFixture(
        "closed-orphan",
        "deleted-group",
        createTabFixture("tab-2", "Recovered orphan", {
          tabColor: "purple",
        }),
      ),
    ],
    nextTabNumber: 3,
  });
  await openPanel(page, "dashboard-panel");

  const closedColumn = dashboardColumn(page, "done");
  await expect(closedColumn.locator(".dashboard-card")).toHaveCount(1);
  await expect(closedColumn).toContainText("Recovered orphan");
  await closedColumn.locator(".dashboard-card-open").click();

  await expect(dashboardPanel(page)).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("textarea")).toHaveValue("Recovered orphan");
  const stored = await readStoredState(page);
  expect(stored.activeGroupId).toBe("ungrouped");
  expect(stored.closedTabs).toHaveLength(0);
  expect(
    stored.groups
      .find((group) => group.id === "ungrouped")
      ?.tabs.filter((tab) => tab.id === "tab-2"),
  ).toHaveLength(1);
});
