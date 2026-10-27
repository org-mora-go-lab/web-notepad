import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardColumn, openPanel, writeStoredState } from "../../__util__";
test("1. 기존 색상 분류를 유지하고 Note To Do Ready Doing Done 순서로 표시한다", async ({
  page,
}) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture(
        "ungrouped",
        "Ungrouped",
        [
          createTabFixture("note", "Note card", { dashboardStatus: "icebox" }),
          createTabFixture("todo", "Todo card", { tabColor: "gray" }),
          createTabFixture("ready", "Ready card", {
            tabColor: "orange",
            dashboardStatus: "ready",
          }),
          createTabFixture("doing", "Doing card", { tabColor: "indigo" }),
          createTabFixture("done", "Done card", { tabColor: "teal" }),
        ],
        { dashboardVisibility: { icebox: true, done: true } },
      ),
    ],
  });
  await openPanel(page, "dashboard-panel");
  await expect(
    page.locator(".dashboard-statuses .dashboard-status-label"),
  ).toHaveText(["Note", "To Do", "Ready", "Doing", "Done"]);
  for (const [status, color] of [
    ["icebox", "yellow"],
    ["todo", "gray"],
    ["ready", "orange"],
    ["in-progress", "indigo"],
    ["done", "teal"],
  ] as const)
    await expect(dashboardColumn(page, status)).toHaveAttribute(
      "data-tab-color",
      color,
    );
  for (const [status, title] of [
    ["icebox", "Note card"],
    ["todo", "Todo card"],
    ["ready", "Ready card"],
    ["in-progress", "Doing card"],
    ["done", "Done card"],
  ] as const)
    await expect(
      dashboardColumn(page, status).locator(".dashboard-card", {
        hasText: title,
      }),
    ).toBeVisible();
});
