import { expect, test } from "@playwright/test";

import {
  createClosedTabFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import { openPanel, readStoredState, writeStoredState } from "../../__util__";
import { dashboardColumn, dashboardPanel } from "../__util__";

test("7. 일반적이지 않은 닫은 탭 ID의 카드를 Todo로 옮겨도 닫힌 상태를 유지한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Open note", { tabColor: "green" }),
      ]),
    ],
    closedTabs: [
      createClosedTabFixture(
        "legacy:archive/2",
        "ungrouped",
        createTabFixture("restored-custom-id", "Legacy Todo note", {
          tabColor: "purple",
        }),
      ),
    ],
    nextTabNumber: 3,
  });
  await openPanel(page, "dashboard-panel");

  await dashboardColumn(page, "done")
    .locator(".dashboard-card", { hasText: "Legacy Todo note" })
    .dragTo(dashboardColumn(page, "todo"));

  const restoredCard = dashboardColumn(page, "todo").locator(
    ".dashboard-card",
    { hasText: "Legacy Todo note" },
  );
  await expect(restoredCard).toHaveCount(1);
  await expect(restoredCard).toHaveAttribute("data-tab-color", "gray");
  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(2);
  const stored = await readStoredState(page);
  expect(stored.closedTabs).toHaveLength(1);
  expect(stored.closedTabs?.[0].tab.tabColor).toBe("gray");
  await expect(page.locator(".tab-item", { hasText: "Legacy Todo note" })).toHaveCount(0);
});
