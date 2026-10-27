import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import {
  dashboardColumn,
  openPanel,
  readActiveGroup,
  writeStoredState,
} from "../../__util__";
test("2. Ready로 이동한 노트는 Orange와 내용을 새로고침 뒤에도 보존한다", async ({
  page,
}) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("task", "Ready persistence", { tabColor: "gray" }),
      ]),
    ],
  });
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo")
    .locator(".dashboard-card")
    .dragTo(dashboardColumn(page, "ready"));
  await page.reload();
  await expect(page.locator(".tab-item.is-active")).toBeVisible();
  if (
    (await page.locator("#dashboard-panel").getAttribute("aria-hidden")) !==
    "false"
  )
    await openPanel(page, "dashboard-panel");
  await expect(
    dashboardColumn(page, "ready").locator(".dashboard-card"),
  ).toContainText("Ready persistence");
  const group = await readActiveGroup(page);
  expect(group.tabs[0]).toMatchObject({
    content: "Ready persistence",
    tabColor: "orange",
    dashboardStatus: "ready",
  });
});
