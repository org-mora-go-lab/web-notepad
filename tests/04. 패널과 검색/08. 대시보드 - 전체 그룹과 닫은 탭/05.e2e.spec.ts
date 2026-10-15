import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardColumn, dashboardPanel } from "../__util__";

test("5. Done 카드를 누르면 위치와 상태·내용을 유지한 채 편집기에 복원한다", async ({ page }) => {
  const group = createGroupFixture("ungrouped", "Ungrouped", [
    createTabFixture("tab-1", "First closed task", { tabColor: "purple" }),
    createTabFixture("tab-3", "Third closed task", { tabColor: "purple" }),
  ]);
  await writeStoredState(page, {
    activeGroupId: group.id,
    groups: [group],
    closedTabs: [
      createClosedTabFixture(
        "closed-2",
        group.id,
        createTabFixture("tab-2", "Second closed task", { tabColor: "purple" }),
      ),
    ],
  });
  await openPanel(page, "dashboard-panel");
  const panel = dashboardPanel(page);
  await panel.getByRole("button", { name: "Pin panel", exact: true }).click();
  const column = dashboardColumn(page, "done");
  const titles = column.locator(".dashboard-card strong");
  await expect(titles).toHaveText([
    "First closed task",
    "Second closed task",
    "Third closed task",
  ]);
  const closed = column.locator(".dashboard-card", { hasText: "Second closed task" });
  const before = (await closed.boundingBox())!;
  await closed.locator(".dashboard-card-open").click();

  await expect(page.locator("textarea")).toHaveValue("Second closed task");
  await expect(titles).toHaveText([
    "First closed task",
    "Second closed task",
    "Third closed task",
  ]);
  await expect.poll(async () => (await closed.boundingBox())!.y).toBeCloseTo(before.y, 0);
});
